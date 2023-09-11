import { Container, Text, Box, Image } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import "../App.css";

import ListCombines from "../components/ListCombines";

const Home = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.xl" pt={5} pb={5}>
        <Box
          display={{ base: "block", md: "flex" }}
          justifyContent="space-between"
        >
          {/* Orta Bölüm */}
          <Box flex="2" p={5} mr={{ md: 2 }} mb={{ base: 2, md: 0 }}>
            <ListCombines />
          </Box>

          {/* Sağ Bölüm */}
          <Box flex="1" p={5} bg={"blue.200"}>
            <Box position={"fixed"} bg={"red.200"}>
              <Text>adsflkjsdlfkj</Text>
              <Text>adsflkjsdlfkj</Text>
              <Box>
                <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
