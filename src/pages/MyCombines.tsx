import React from 'react'
import NavBar from "../components/Navbar"
import { MainContext, useContext } from '../context/Context'
import ListCombines from '../components/ListCombines'
import { Container } from '@chakra-ui/react'

const MyCombines = () => {

  const {username} = useContext(MainContext);

  return (
    <div>
      <NavBar />
      <Container>
        <ListCombines username={username} />
      </Container>
    </div>
  )
}

export default MyCombines