import React from "react";
import { Container, Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ListCombines from "../components/ListCombines";

const AllCombines = () => {
  return (
    <Box background={"black"}> 
      <Navbar />
      <Box pt={75}>
        <ListCombines />
      </Box>
    </Box>
  );
};

export default AllCombines;
