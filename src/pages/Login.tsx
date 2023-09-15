import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/firebase";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Context
import { MainContext, useContext } from "../context/Context";

const Login:React.FC = () => {
  // Contex den gelen veriler alınıyor.
  const { user } = useContext(MainContext);
  // Stateler oluşturuluyor.
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  // login methodunu çalıştır ve giriş yap.
  async function onSubmitHandle(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(email, password);
  }

  // eğer kullanıcı giriş yapmışsa direkt "dashboard" sayfasına yönlendir.
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user,navigate]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Text color={"blue.400"}>features</Text> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={onSubmitHandle}>
          <Stack spacing={4}>
            <FormControl id="email" onChange={(e) => setEmail((e.target as HTMLInputElement).value)}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl
              id="password"
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            >
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text color={"blue.400"}>
                  <Link to={"/register"}>Don't have an account?</Link>
                </Text>
              </Stack>
              <Button
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
