import { Container, Text, Box, Image } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import "../App.css";

import ListCombines from "../components/ListCombines";

const Home:React.FC = () => {
  return (
    <Box background={"black"}> 
      <Navbar />
      <Container pt={75}>
        <ListCombines />
      </Container>
    </Box>
  );
};

export default Home;
