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
  CircularProgress,
} from "@chakra-ui/react";

import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { MainContext, useContext } from "../context/Context";
import { CheckCircleIcon } from "@chakra-ui/icons";

interface IProps {
  item: ICombine;
  email: string;
}

interface IPrediction {
  id: string;
  pick: number;
  teams: string;
  type: string;
}

interface ICombine {
  boughtUsers: string[];
  combine: IPrediction[];
  credit: number;
  id: string;
  totalOdds:number;
  likedUsers: string[];
  sender: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  username: string;
  isLiked: boolean;
  isBought: boolean;
  profileImage: string | null;
}

export const Combine: React.FC<IProps> = ({ item, email }) => {
  const { user, credit, setCredit, id } = useContext(MainContext);

  async function likeCombine(id: string): Promise<void> {
    if (user) {
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
  }

  async function buyCombine(id: string): Promise<void> {
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
      }).then(() => setCredit(credit - item.credit));
    }
  }

  function formatTimestamp(timestamp: any) {
    const date = timestamp.toDate(); // Firestore Timestamp'ini JavaScript Date'ine dönüştür

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0"); // Saati iki basamaklı olarak göster
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Dakikayı iki basamaklı olarak göster

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }

  return (
    <Box w="100%">
      <Card key={item.id} style={{backgroundColor:"#212121"}} mb={3}>
        <Box className="flex" justifyContent={"space-between"} style={{backgroundColor:"#676767"}} p={2}>
         

          <Box display={"flex"} flexDirection={"row"}>
          {item.profileImage && (
            <Image
              borderRadius="full"
              boxSize="48px"
              src={item.profileImage}
              alt="Image"
            />
          )}
            <Box ml={2}>
            <Link to={"/u/" + item.username}>
              
              <Box display={"flex"}>
              <Text size="md">{item.username}</Text>
              
              </Box>
            </Link>

            <Text fontSize={"smaller"}>{formatTimestamp(item.timestamp)}</Text>
            </Box>
          </Box>
         
          <Badge colorScheme={"orange"}>{item?.totalOdds?.toFixed(2)}</Badge>
        
        </Box>

        

        {item.credit === 0 || item.sender === id || item.isBought ? (
          item.combine.map((item: IPrediction) => (
            <Box key={item.id} pl={5} m={2}>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <h4>{item.teams}</h4>
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
            </Box>
          ))
        ) : (
          <Box display={"flex"} m={3}>
            <FiLock size={35} color={"red"}></FiLock>
            <Text ml={2}>You have to buy this combine to see details.</Text>
          </Box>
        )}

        <Box m={3} background={"blackAlpha.100"}>
          {email === "" ? (
            <Card p={1} m={1}>
              <Text color={"black"}>{item.likedUsers.length} users liked.</Text>
            </Card>
          ) : (
            <Button
              m={2}
              size={"sm"}
              colorScheme={item.isLiked ? "red" : "gray"}
              onClick={() => likeCombine(item.id)}
            >
              {item.isLiked ? (
                <Text color={"black"}>{item.likedUsers.length} Like</Text>
              ) : (
                <Text color={"black"}> {item.likedUsers.length} Like</Text>
              )}
            </Button>
          )}

          {email === "" ? (
            <Card p={1} m={1}>
              <Text color={"black"}>
                {item.boughtUsers.length} users bought.
              </Text>
            </Card>
          ) : item.isBought ? (
           <Button leftIcon={<CheckCircleIcon width={25} />} size={"sm"} isDisabled={true} colorScheme="green">Purchased!</Button>
          ) : (
            item.sender === id ? "" : item.credit === 0 ? <Button leftIcon={<CheckCircleIcon width={25} />} size={"sm"} isDisabled={true} colorScheme="blue">Free!</Button> :  <Button
            m={2}
            size={"sm"}
            colorScheme={item.isBought ? "blue" : "green"}
            onClick={() => buyCombine(item.id)}
          >
            {item.isBought
              ? ""
              : item.credit === 0
              ? "FREE"
              : item.credit + " Credits"}
          </Button> 
          )}
        </Box>
      </Card>
    </Box>
  );
};
