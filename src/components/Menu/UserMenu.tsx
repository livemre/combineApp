import { Avatar, Button, Text, Card, Box } from '@chakra-ui/react'
import React from 'react'
import { MainContext, useContext } from '../../context/Context'
import { Link } from 'react-router-dom'
import { AddIcon, CheckCircleIcon, LockIcon} from "@chakra-ui/icons";
import {signOut, auth} from "../../services/firebase"
import { useNavigate } from 'react-router-dom';

const UserMenu = ():any => {


    const {profileImage, username, credit, setUser, setEmail} = useContext(MainContext)
    const navigate = useNavigate();



    async function Logout() {

     await signOut(auth).then(()=> {
      setUser(null);
      setEmail(null);
      navigate("/login")} );
      
    }


  return (
    <Box m={5} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"}>
        <Avatar size={"2xl"} src={profileImage}/>
        <Text>{username}</Text>
       <Link to={"/editProfile"}> <Button colorScheme='red' variant={'outline'} mt={2}>Edit Profile</Button></Link>
       <Box w={"full"} m={5}>
       <Card w={"full"} background={"gray"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
       <Text fontSize={16} colorScheme='blue' pl={2}>Credit : {credit}</Text>
       <Button colorScheme='green'>Add Credit</Button>
       </Card>
       </Box>
      <Box w={"full"}>
     
    
      <Card mb={1} background={"green.500"}><Link to={"/addMatch"}><div className='flex'><AddIcon color={"white"} width={"1rem"} height={"1rem"} mr={2} /><Text fontSize={"1rem"} fontWeight={"semibold"} color={"white"}>Add Combine</Text></div></Link></Card>
       
       <Card mb={1} background={"blue.500"}><Link to={"/allCombines"}><div className='flex'><CheckCircleIcon color={"white"} width={"1rem"} height={"1rem"} mr={2} /><Text fontSize={"1rem"} fontWeight={"semibold"} color={"white"}>All Combines</Text></div></Link></Card>
       <Card mb={1} background={"blue.500"}><Link to={"/myCombines"}><div className='flex'><CheckCircleIcon color={"white"} width={"1rem"} height={"1rem"} mr={2} /><Text fontSize={"1rem"} fontWeight={"semibold"} color={"white"}>My Combines</Text></div></Link></Card>
       <Card onClick={()=>Logout()} mb={1} background={"red.500"}><Link to={"/"}><div className='flex'><LockIcon color={"white"} width={"1rem"} height={"1rem"} mr={2} /><Text fontSize={"1rem"} fontWeight={"semibold"} color={"white"}>Logout</Text></div></Link></Card>
      
      </Box>
    </Box>
  )
}

export default UserMenu