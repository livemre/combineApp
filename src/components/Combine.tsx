import React from "react";
import { FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

import {
  Button,
  CardBody,
  Card,
  CardFooter,
  Image,
  Text,
  Badge,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Box,
} from "@chakra-ui/react";

import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

interface IProps {
  item:ICombine;
  email:string;
}

interface IPrediction {
  id:string;
  pick:number;
  teams: string;
  type: string;

}

interface ICombine {
  boughtUsers : string [];
  combine: IPrediction[];
  credit: number;
  id:string;
  likedUsers : string[];
  sender : string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  username : string;
  isLiked : boolean;
  isBought : boolean;
  profileImage : string | null;
}

export const Combine:React.FC<IProps> = ({ item, email }) => {
  async function likeCombine(id:string):Promise<void> {
    

    // Tweet belgesinin referansını al
    const combineRef = doc(db, "combines", id);

    // Tweet belgesini al
    const tweetSnap = await getDoc(combineRef);
    const tweetData = tweetSnap.data();

    // Kullanıcının tweeti beğenip beğenmediğini kontrol et
    if (tweetData?.likedUsers.includes(email)) {
      // Eğer kullanıcı tweeti zaten beğendi ise, e-postasını likedUsers dizisinden kaldır
      await updateDoc(combineRef, {
        likedUsers: arrayRemove(email),
      });
    } else {
      // Eğer kullanıcı tweeti beğenmedi ise, e-postasını likedUsers dizisine ekleyin
      await updateDoc(combineRef, {
        likedUsers: arrayUnion(email),
      });
    }
  }

  async function buyCombine(id:string):Promise<void> {


    // Tweet belgesinin referansını al
    const combineRef = doc(db, "combines", id);

    // Tweet belgesini al
    const combineSnap = await getDoc(combineRef);
    const combineData = combineSnap.data();

    // Kullanıcının tweeti beğenip beğenmediğini kontrol et
    if (combineData?.boughtUsers.includes(email)) {
      // Eğer kullanıcı tweeti zaten beğendi ise, e-postasını likedUsers dizisinden kaldır
      await updateDoc(combineRef, {
        boughtUsers: arrayRemove(email),
      });
    } else {
      // Eğer kullanıcı tweeti beğenmedi ise, e-postasını likedUsers dizisine ekleyin
      await updateDoc(combineRef, {
        boughtUsers: arrayUnion(email),
      });
    }
  }

  return (
    <Box w="100%">
      <Card key={item.id} className="bg-combine" m={3}>
        <CardHeader className="flex">
          {item.profileImage && (
            <Image
              borderRadius="full"
              boxSize="32px"
              src={item.profileImage}
              alt="Image"
            />
          )}
          <Text size="md" className="ml-3">
            <Link to={"/u/" + item.username}>{item.username}</Link>
          </Text>
        </CardHeader>
        <hr className="bg-black" />

        {item.credit === 0 || item.isBought ? (
          item.combine.map((item:IPrediction) => (
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    {item.teams}
                  </Heading>
                  <div className="flex">
                    <Badge
                      className="mr-3 minwidth2rem"
                      variant="solid"
                      colorScheme="green"
                    >
                      {item.pick}
                    </Badge>
                    <Text fontSize="sm">
                      {" "}
                      {item.type === "homeWin" ? "Home Wins" : ""}
                      {item.type === "awayWin" ? "Away Wins" : ""}
                      {item.type === "draw" ? "Draw" : ""}
                      {item.type === "over" ? "2,5 Goal Over" : ""}
                      {item.type === "under" ? "2,5 Goal Under" : ""}
                    </Text>
                  </div>
                </Box>
              </Stack>
            </CardBody>
          ))
        ) : (
          <div className="flex-jc mt-3">
            <FiLock size={50}></FiLock>
            <Text>You have to buy this combine to see details.</Text>
          </div>
        )}

        <CardFooter>
          {email === "" ? (
            <Card p={1} m={1}>
              <Text>{item.likedUsers.length} users liked.</Text>
            </Card>
          ) : (
            <Button
              m={2}
              colorScheme={item.isLiked ? "red" : "gray"}
              onClick={() => likeCombine(item.id)}
            >
              {item.isLiked ? (
                <Text>{item.likedUsers.length} Like</Text>
              ) : (
                <Text> {item.likedUsers.length} Like</Text>
              )}
            </Button>
          )}

          {email === "" ? (
            <Card p={1} m={1}>
              <Text>{item.boughtUsers.length} users bought.</Text>
            </Card>
          ) : item.isBought ? (
            <Button m={2}> Bought</Button>
          ) : (
            <Button
              m={2}
              colorScheme={item.isBought ? "blue" : "green"}
              onClick={() => buyCombine(item.id)}
            >
              {item.isBought ? "BOUGHT" : item.credit + " Credits"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Box>
  );
};
