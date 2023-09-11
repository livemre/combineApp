import React from "react";

import { Container } from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ListCombines from "../components/ListCombines";

const UserProfile = () => {
  let { username } = useParams();

  return (
    <div>
      <Navbar />
      <Container>
        <ListCombines username={username} />
      </Container>
    </div>
  );
};

export default UserProfile;
