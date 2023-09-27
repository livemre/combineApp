import React, {useState, useEffect} from "react";

import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardFooter, Container, Divider, Heading, Stack, Text } from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ListCombines from "../components/ListCombines";
import { Image } from "@chakra-ui/react";
import { getUserData, db } from "../services/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { MainContext, useContext } from "../context/Context";

const UserProfile = () => {
  let { username } = useParams();

  const [profileImage,setProfileImage] = useState<string>("")
  const [desc, setDesc] = useState<string> ("");

  const {user, email} = useContext(MainContext);

  useEffect(()=> {
    getUserDatas();
  }, [])

  async function getUserDatas() {
    await getUserData("",username).then((item)=> setProfileImage(item.profileImage))
    await getUserData("",username).then((item2)=> setDesc(item2.desc));
  }

  async function followUser(id:string):Promise<void> {
    
    if(user) {
      
        // Tweet belgesinin referansını al
        const combineRef = doc(db, "combines", id);
    
        // Tweet belgesini al
        const tweetSnap = await getDoc(combineRef);
        const tweetData = tweetSnap.data();
    
        // Kullanıcının tweeti beğenip beğenmediğini kontrol et
        if (tweetData?.likedUsers.includes(email)) {
          // Eğer kullanıcı tweeti zaten beğendi ise, e-postasını likedUsers dizisinden kaldır
          await updateDoc(combineRef, {
            likedUsers: arrayRemove(email),
          });
        } else {
          // Eğer kullanıcı tweeti beğenmedi ise, e-postasını likedUsers dizisine ekleyin
          await updateDoc(combineRef, {
            likedUsers: arrayUnion(email),
          });
        }
    }
      }
  return (
    <Box background={"black"}>
      <Navbar />


  
    
      <Box background={"black"} pt={75}>

<div className="profile-header">
    <div className="profile">
      <div className="flex-center-col">
      <img className="profile-image" src={profileImage} alt="a" />
      <h4>{username}</h4>
      </div>
      <div>
      <div className="profile-stats">
        <div className="profile-stats-item">
          <div className="profile-item-numbers"><p>710</p></div>
          <div className="profile-item"><p>Combines</p></div>
        </div>
        <div className="profile-stats-item">
          <div className="profile-item-numbers"><p>24</p></div>
          <div className="profile-item"><p>WON</p></div>
        </div>
        <div className="profile-stats-item">
          <div className="profile-item-numbers"><p>128</p></div>
          <div className="profile-item"><p>LOST</p></div>
        </div>

      </div>
        <div>
        <div className="follow-div">
      <p className="user-follow-text">26 user follows</p>
     <Button size={"sm"} color={"red"}>Follow</Button>
     </div>
        </div>
      
      </div>
    </div>
      
      <p className="profile-desc">{desc}</p>
     
</div>
    
     
    
     
      
     
      <ListCombines username={username} />
      
      </Box>
    </Box>
  );
};

export default UserProfile;
