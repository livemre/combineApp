import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  register,
  checkUsername,
  registerUsertoFirestore,
} from "../services/firebase";

import { MainContext, useContext } from "../context/Context";

import "../App.css";

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  InputRightElement,
  InputGroup,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";

import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import Navbar from "../components/Navbar"

 const Register:React.FC =  () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [showRegisterButton, setShowRegisterButton] = useState<boolean>(false);
  const [usernameAvaliable, setUsernameAvaliable] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [iconHide, setIconHide] = useState<boolean>(true);
  const [passwordErrorColor, setPasswordErrorColor] = useState<string>("");

  const navigate = useNavigate();
  const { user } = useContext(MainContext);

  // Eğer user varsa Dashboard sayfasına yönlendir.
  useEffect(() => {
    if (user) {
      navigate("/allCombines");
    }
  }, [user,navigate]);

  interface AvatarItem  {
    name : string
    url: string
  }

  // Sol taraftaki ufak avatarlar
  const avatars : AvatarItem[] = [
    {
      name: "Ryan Florence",
      url: "https://bit.ly/ryan-florence",
    },
    {
      name: "Segun Adebayo",
      url: "https://bit.ly/sage-adebayo",
    },
    {
      name: "Kent Dodds",
      url: "https://bit.ly/kent-c-dodds",
    },
    {
      name: "Prosper Otemuyiwa",
      url: "https://bit.ly/prosper-baba",
    },
    {
      name: "Christian Nwamba",
      url: "https://bit.ly/code-beast",
    },
  ];

  //Alanların doluluğuna göre register butonunu göster/gizle yapıyoruz.
  useEffect(() => {
    if (usernameAvaliable) {
      if (password === passwordVerification) {
        if (email && password && passwordVerification && username) {
          setShowRegisterButton(true);
        } else {
          setShowRegisterButton(false);
        }
      } else {
        setShowRegisterButton(false);
      }
    } else {
      setShowRegisterButton(false);
    }
  }, [
    email,
    password,
    passwordVerification,
    username,
    showRegisterButton,
    usernameAvaliable,
  ]);

  //Şifre uzunluğu, eşleşmesine göre kontrol yapıp mesaj ekliyoruz.
  useEffect(() => {
    if (password.length > 5 && passwordVerification.length > 5) {
      if (password !== passwordVerification) {
        setPasswordError("Şifreler eşleşmiyor!");
        setPasswordErrorColor("red");
      } else {
        setPasswordError("Süper!");
        setPasswordErrorColor("green");
      }
    } else {
      if (password.length < 1) {
        setPasswordError("");
      } else {
        setPasswordError("Şifreler en az 5 karakter olmalı.");
        setPasswordErrorColor("red");
      }
    }
  }, [password, passwordVerification]);

  //Username bilgisini veritabanından kontrol edip mesaj gösteriyoruz.
  useEffect(() => {
    if (username.length > 2) {
      setIconHide(false);
      checkUsername(username).then((value) => {
        if (value === true) {
          setUsernameMessage("This username is already taken");
          setUsernameAvaliable(false);
        } else {
          setUsernameMessage("This username is available.");
          setUsernameAvaliable(true);
        }
      });
    } else {
      setUsernameMessage("Username en az 3 karakter olmalı!");
      setIconHide(true);
    }
  }, [username, usernameMessage]);

  //State deki bilgilere göre register fonksiyonunu çalıştırıp üye kaydı (auth) yapıyoruz.
  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await register(email, password);

      //Üye kaydı yapıldıysa, firestore da "users" koleksiyonuna üyenin bilgilerini geçiyoruz.

      const userID = user.uid;

      await registerUsertoFirestore(userID, email, username);
    } catch (e:any) {
      console.log("Bir hata oluştu!" + e);
      setError(e.message);
    }
  }

  return (
 
    <Box>
      <Navbar />
      <Box position={"relative"} pt={25}>
    <Container
      as={SimpleGrid}
      maxW={"7xl"}
      columns={{ base: 1, md: 2 }}
      spacing={{ base: 10, lg: 32 }}
      py={{ base: 10, sm: 20, lg: 32 }}
    >
      <Stack spacing={{ base: 10, md: 20 }}>
        <Heading
          lineHeight={1.1}
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
        >
          Where Football Tipsters Score and Followers Cheer!
        </Heading>
        <Stack direction={"row"} spacing={4} align={"center"}>
          <AvatarGroup>
            {avatars.map((avatar) => (
              <Avatar
                key={avatar.name}
                name={avatar.name}
                src={avatar.url}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                size={useBreakpointValue({ base: "md", md: "lg" })}
                position={"relative"}
                zIndex={2}
                _before={{
                  content: '""',
                  width: "full",
                  height: "full",
                  rounded: "full",
                  transform: "scale(1.125)",
                  bgGradient: "linear(to-bl, red.400,pink.400)",
                  position: "absolute",
                  zIndex: -1,
                  top: 0,
                  left: 0,
                }}
              />
            ))}
          </AvatarGroup>
          <Text fontFamily={"heading"} fontSize={{ base: "4xl", md: "6xl" }}>
            +
          </Text>
          <Flex
            align={"center"}
            justify={"center"}
            fontFamily={"heading"}
            fontSize={{ base: "sm", md: "lg" }}
            bg={"gray.800"}
            color={"white"}
            rounded={"full"}
            minWidth={useBreakpointValue({ base: "44px", md: "60px" })}
            minHeight={useBreakpointValue({ base: "44px", md: "60px" })}
            position={"relative"}
            _before={{
              content: '""',
              width: "full",
              height: "full",
              rounded: "full",
              transform: "scale(1.125)",
              bgGradient: "linear(to-bl, orange.400,yellow.400)",
              position: "absolute",
              zIndex: -1,
              top: 0,
              left: 0,
            }}
          >
            YOU
          </Flex>
        </Stack>
      </Stack>
      <Stack
        bg={"gray.50"}
        rounded={"xl"}
        p={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 8 }}
        maxW={{ lg: "lg" }}
      >
        <Stack spacing={4}>
          <Heading
            color={"gray.800"}
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
          >
            Join the Elite Circle of Football Prognosticators
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              !
            </Text>
          </Heading>
          <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
            Step into the world of football experts, share your predictions,
            and prove your expertise! Every prediction you make brings you
            closer to legendary status. Register now and start your journey to
            becoming the top football pundit.
          </Text>
        </Stack>
        <FormControl>
          <p>{error}</p>
          <form  onSubmit={handleSubmit}>
          <Box mt={10}>
            <Stack spacing={4}>
              <InputGroup>
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="Username"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                />

                <InputRightElement>
                  {!iconHide ? (
                    usernameAvaliable ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <CloseIcon color="red" />
                    )
                  ) : (
                    ""
                  )}
                </InputRightElement>
              </InputGroup>
              <FormHelperText style={{ marginTop: -10 }}>
                {!iconHide ? (
                  usernameAvaliable ? (
                    <Text color={"green"}>{usernameMessage}</Text>
                  ) : (
                    <Text color={"red"}>{usernameMessage}</Text>
                  )
                ) : (
                  ""
                )}
              </FormHelperText>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="firstname@lastname.io"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
              />
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                placeholder="Password"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
              />
              <Input
                onChange={(e) => setPasswordVerification(e.target.value)}
                type="password"
                value={passwordVerification}
                placeholder="Password"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
              />
              <FormHelperText style={{ marginTop: -10 }}>
                {<Text color={passwordErrorColor}>{passwordError}</Text>}
              </FormHelperText>
              <Text color={"blue.400"}>
                <Link to={"/login"}>Already have an account?</Link>
              </Text>
            </Stack>

            {showRegisterButton ? (
              <Button
               type="submit"
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                isDisabled={true}
                type="submit"
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
              >
                Submit
              </Button>
            )}
          </Box>
          </form>
        </FormControl>
        form
      </Stack>
    </Container>
  </Box>
    </Box>

  );

}

export default Register;
