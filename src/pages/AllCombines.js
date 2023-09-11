import React from "react";
import { Container } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ListCombines from "../components/ListCombines";

const AllCombines = () => {
  return (
    <div>
      <Navbar />
      <Container>
        <ListCombines />
      </Container>
    </div>
  );
};

export default AllCombines;
