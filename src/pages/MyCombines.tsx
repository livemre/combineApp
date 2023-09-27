import React from 'react'
import NavBar from "../components/Navbar"
import { MainContext, useContext } from '../context/Context'
import ListCombines from '../components/ListCombines'
import { Container, Box } from '@chakra-ui/react'

const MyCombines = () => {

  const {username} = useContext(MainContext);

  return (
    <Box background={"black"}> 
      <NavBar />
      <Container pt={75}>
        <ListCombines username={username}/>
      </Container>
    </Box>
  )
}

export default MyCombines