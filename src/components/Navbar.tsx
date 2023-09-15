import React,{FC} from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,

} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { MainContext, useContext } from "../context/Context";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { signOut, auth } from "../services/firebase";

interface ILink {
  title: string;
  url: string;
}

const Links:ILink[] = [
  { title: "All Combines", url: "/allCombines" },
  { title: "My Combines", url: "/myCombines" },
];

const NoUserLinks: ILink[] = [
  { title : "Home" , url: "/"}
]

const  WithAction: FC = ()=> {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { profileImage, user } = useContext(MainContext);
  const navigate = useNavigate();

  async function logOut() {
    return await signOut(auth).then(()=> navigate("/login"));
  }

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
       {user?  <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink to={link.url} key={link.title}>
                  {link.title}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              onClick={() => navigate("/addMatch")}
              leftIcon={<AddIcon />}
            >
              Add New Combine
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={profileImage} />
              </MenuButton>
              <MenuList>
                <Link to="/editProfile"> <MenuItem>Edit Profile</MenuItem> </Link>
                
                <MenuDivider />
                <MenuItem onClick={logOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex> : 
         <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
         <IconButton
           size={"md"}
           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
           aria-label={"Open Menu"}
           display={{ md: "none" }}
           onClick={isOpen ? onClose : onOpen}
         />
         <HStack spacing={8} alignItems={"center"}>
           <Box>Logo</Box>
           <HStack
             as={"nav"}
             spacing={4}
             display={{ base: "none", md: "flex" }}
           >
             {NoUserLinks.map((link) => (
               <NavLink to={link.url} key={link.title}>
                 {link.title}
               </NavLink>
             ))}
           </HStack>
         </HStack>
         <div className='flex-center'>
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button>Register</Button></Link>
          </div>
       </Flex>
        }

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink to={"/emre"} key={link.title}>{link.title}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default WithAction;
