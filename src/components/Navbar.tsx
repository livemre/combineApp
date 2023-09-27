import React,{FC,useRef, useEffect} from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image


} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon, EmailIcon } from "@chakra-ui/icons";
import { MainContext, useContext } from "../context/Context";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { signOut, auth, addCredit } from "../services/firebase";
import UserMenu from './Menu/UserMenu';
import NoUserMenu from './Menu/NoUserMenu';






const  WithAction: FC = ()=> {


  const { profileImage, user, setEmail, credit, id } = useContext(MainContext);
  const navigate = useNavigate();


  

  async function logOut() {
    
    setEmail("")
    return await signOut(auth).then(()=> {
      
      navigate("/")});
  }


  const sideMenuRef = useRef<HTMLDivElement>(null);
  const profilePicRef = useRef<any>(HamburgerIcon);
  const openNav = () => {
    if (sideMenuRef.current) {
        sideMenuRef.current.style.width = "80%";
    }
}

const closeNav = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (sideMenuRef.current && profilePicRef.current) {
        if (target !== profilePicRef.current && !sideMenuRef.current.contains(target)) {
            sideMenuRef.current.style.width = "0%";
        }
    }
}


  useEffect(() => {
    // Tüm sayfa için tıklama olayını dinle
    document.addEventListener('click', closeNav);

    // Etki temizleyici fonksiyonu
    return () => {
        // Bileşen kaldırıldığında olay dinleyiciyi kaldır
        document.removeEventListener('click', closeNav);
    };
}, []); // Boş bağımlılık dizisi ile sadece bileşen yüklendiğinde ve kaldırıldığında çalışır



  return (
    <div className='navbar-bar'>


    <div className="menu-buttons" style={{margin:5}}>


        <HamburgerIcon 
            
            m={1}
            className="profile-pic" 
            onClick={openNav} 
            ref={profilePicRef}
            color={"whatsapp.100"}
            width={25}
            height={25}
         
            
        />

        <Link to={"/"}><Image m={1}  src="http://sportstipsfree.click/logo-combineapp.png" width={150} height={30}/></Link>
        <EmailIcon color={"whatsapp.100"}
            width={25}
            height={25} />
    </div>

    {<div ref={sideMenuRef} className="side-nav"><div className='side-nav-content'> {user ? <UserMenu /> : <NoUserMenu /> } </div> </div>}
</div>
  );
}

export default WithAction;
