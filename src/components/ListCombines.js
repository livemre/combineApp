import React, { useState, useEffect } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { MainContext, useContext } from "../context/Context";
import { Box, Card, Container, Spinner } from "@chakra-ui/react";
import { Combine } from "../components/Combine";

const ListCombines = ({ username = null }) => {
  const { email } = useContext(MainContext);
  const [combines, setCombines] = useState([]);

  useEffect(() => {
    getAllCombines();
  }, [combines]);

  async function getAllCombines() {
    let q;
    if (username) {
      q = query(collection(db, "combines"), where("username", "==", username));
    } else {
      q = query(collection(db, "combines"));
    }

    const querySnapshot = await getDocs(q);

    // Promise.all ile tüm asenkron işlemleri aynı anda yapıyoruz. verileri
    const combinesArray = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const combineData = doc.data();
        const profileImage = await getCombineSenderProfileImage(
          combineData.sender
        );
        const isLiked = await isCombineLikedByUser(combineData);
        const isBought = await isCombineBoughtByUser(combineData);
        return { ...combineData, profileImage, isLiked, isBought };
      })
    );

    // Veriyi zaman damgasına göre sıralayarak state'e kaydetme
    setCombines(combinesArray.sort((a, b) => b.timestamp - a.timestamp));
  }

  function isCombineLikedByUser(combine) {
    return combine.likedUsers.includes(email);
  }

  function isCombineBoughtByUser(combine) {
    return combine.boughtUsers.includes(email);
  }

  async function getCombineSenderProfileImage(id) {
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
          //Tüm combineler map ile işlem görüyor ve "Combine" komponenti ile gösteriliyor
          combines.map((item) => (
            <Combine key={item.id} item={item} email={email} />
          ))
        )}
      </Container>
    </div>
  );
};

export default ListCombines;
