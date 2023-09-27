import React, { useState, useEffect } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { MainContext, useContext } from "../context/Context";
import { Box, Card, Container, Spinner } from "@chakra-ui/react";
import { Combine } from "../components/Combine";
import { useParams } from 'react-router-dom';
import FollowBox from "./FollowBox";




interface IPrediction {
  id:string;
  pick:number;
  teams: string;
  type: string;

}

interface IDocData {
  boughtUsers : string [];
  combine: IPrediction[];
  credit: number;
  id:string;
  totalOdds : number;
  likedUsers : string[];
  sender : string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  username : string;
}

interface ICombine extends IDocData{
  isLiked : boolean;
  isBought : boolean;
  profileImage : string | null;
}


interface ListCombinesProps {
  username?: string;
}



const ListCombines = ({ username }:ListCombinesProps) => {
  const { email } = useContext(MainContext);
  const [combines, setCombines] = useState<ICombine[]>([]);

  const getAllCombines = async () => {
    let q;
    if (username) {
      q = query(collection(db, "combines"), where("username", "==", username));
    } else {
      q = query(collection(db, "combines"));
    }

    const querySnapshot = await getDocs(q);

    const combinesArray = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const combineData = doc.data() as IDocData;

        
        
        const profileImage = await getCombineSenderProfileImage(
          combineData.sender
        );
        const isLiked = isCombineLikedByUser(combineData);
        const isBought = isCombineBoughtByUser(combineData);
        return { ...combineData, profileImage, isLiked, isBought } as ICombine;
      })
    );

    setCombines(combinesArray.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
  };


  useEffect(() => {
    getAllCombines();
  }, [combines]);

  function isCombineLikedByUser(combine:IDocData) {
    return combine.likedUsers.includes(email);
  }

  function isCombineBoughtByUser(combine:IDocData) {
    return combine.boughtUsers.includes(email);
  }

  async function getCombineSenderProfileImage(id:string) {
    try {
      const q = query(collection(db, "users"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().profileImage;
      } else {
        console.log("Kullanıcı bulunamadı!");
        return null;
      }
    } catch (error) {
      console.log("Email bulunamadı!");
    }
  }



  return (
    <div>
    <Container>
        {combines.length < 1 ? (
            <Box className="flex-center">
                <Spinner />
            </Box>
        ) : (
            <div>
                {combines.map((item, index) => {
                 
                    return (
                        <div key={index}>
                            {/* Rasgele seçilen aralıklarla Card komponentini göster */}
                            
                            
                            {index % 3 === 0 && index !== 0 ? (<FollowBox />) : null }
                           
                            

                            <Combine key={item.id} item={item} email={email} />
                        </div>
                    );
                })}
            </div>
        )}
    </Container>
</div>

  );
};

export default ListCombines;
