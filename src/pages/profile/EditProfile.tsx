import React, {useState, useEffect} from 'react'
import Navbar from "../../components/Navbar"
import { Button, Card, Container, Text, Avatar } from '@chakra-ui/react'
import { MainContext, useContext } from '../../context/Context'
import uuid from "react-uuid";
import { db } from '../../services/firebase';
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";

const EditProfile = () => {

    const {profileImage, user, setProfileImage, email} = useContext(MainContext);
    const [image, setImage] = useState<any>();
    const [progress, setProgress] = useState<any>(null);
    const [avatar, setAvatar] = useState<string>(profileImage);


    useEffect(()=>{
        setProfileImage(avatar)
        console.log(avatar);
        
    },[avatar])



    async function onImageUpload() {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-images/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        // Yüklemenin durumunu takip et
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // İlerleme yüzdesi
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setProgress(progress);
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          async () => {
            // Yükleme tamamlandı, indirme URL'sini al
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    
            // URL'yi Firestore kullanıcı belgesine kaydet
            const userRef = doc(db, "users", user.uid);
            await setDoc(
              userRef,
              { profileImage: downloadURL },
              { merge: true } // Varolan alanları korumak için
            ).then();
    
            console.log("Profile image uploaded and URL saved to user document.");
    
            // Burada avatar state'ini güncelliyoruz.
            setAvatar(downloadURL);
          }
        );
      }

  return (
    <div>
        <Navbar />
        <Container>
            <Card justifyContent={'center'} alignItems={"center"}>
                <Avatar size={'2xl'} src={profileImage} />
                <Text>{email}</Text>
            </Card>
        <input
  type="file"
  id="profileImageInput"
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  }}
/>
          <Button onClick={onImageUpload}>Upload</Button>
        </Container>
    </div>
  )
}

export default EditProfile