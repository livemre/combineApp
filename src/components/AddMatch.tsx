import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  query,
  collection,
  getDocs,
  Timestamp,
  setDoc,
  addDoc,
} from "firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  Text,
  Tr,
  Th,
  TableContainer,
  Table,
  Thead,
  CardFooter,
  Select,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Badge,
  Flex,
} from "@chakra-ui/react";

import { MainContext, useContext } from "../context/Context";
import { HamburgerIcon } from "@chakra-ui/icons";

import Navbar from "./Navbar";
import "../App.css";

interface IOdds {
  awayWin: any;
  homeWin: any;
  draw: any;
  over: any;
  under: any;
}

interface IMatch {
  awayTeam: string;
  homeTeam: string;
  id: string;
  league: string;
  odds: IOdds;
  startTime: string;
}

interface IYourCombine {
  id: any;
  pick: any;
  teams: any;
  type: any;
}

function AddMatch() {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [yourCombine, setYourCombine] = useState<IYourCombine[]>([]);
  const [totalOdds, setTotalOdds] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const { id, username } = useContext(MainContext);

  console.log("Matches");
  console.log(matches);
  console.log("Your Combine");
  console.log(yourCombine);
  console.log("Total Odds");
  console.log(totalOdds);

  function handlePick(
    matchId: any,
    matchTeams: any,
    oddsValue: any,
    oddsType: any
  ): void {
    // Seçilen oranın zaten yourCombine listesinde olup olmadığını kontrol et
    const pickExists = yourCombine.some(
      (pick) => pick.id === matchId && pick.type === oddsType
    );

    let updatedCombines = [...yourCombine];

    // Eğer bu maç için zaten seçilmiş bir oran varsa, tümünü kaldır
    if (yourCombine.some((pick) => pick.id === matchId)) {
      updatedCombines = yourCombine.filter((item) => item.id !== matchId);
    }

    // Eğer tıklanan oran zaten seçili değilse, ekleyelim.
    // Eğer seçiliyse, yukarıdaki filtreleme ile zaten kaldırılmış olacak.
    if (!pickExists) {
      const newPick = {
        id: matchId,
        teams: matchTeams,
        pick: oddsValue,
        type: oddsType,
      };
      updatedCombines.push(newPick);
    }

    const sortedCombine = updatedCombines.sort(
      (a, b) => Number(b.id) - Number(a.id)
    );
    setYourCombine(sortedCombine);
  }

  useEffect(() => {
    getMatches();
  }, []);

  function handleChange(value: any) {
    return setCredit(value);
  }

  async function onCombineHandler(e: any) {
    e.preventDefault();
    // alert(tweet);

    // Dökümanı ekle ve geriye dönen referansı al

    // Dökümanı ekle ve geriye dönen referansı al
    const docRef = await addDoc(collection(db, "combines"), {
      username: username,
      combine: yourCombine,
      sender: id,
      timestamp: Timestamp.fromMillis(Date.now()),
      likedUsers: [],
      boughtUsers: [],
      credit: credit,
      totalOdds: totalOdds,
    });

    // Oluşturulan dökümanın ID'sini al
    const generatedID = docRef.id;

    // Bu ID'yi dökümanın içeriğine ekleyin
    await setDoc(docRef, { id: generatedID }, { merge: true });

    setYourCombine([]);
  }

  useEffect(() => {
    const total = yourCombine.reduce((accumulator, currentItem) => {
      return accumulator * currentItem.pick;
    }, 1);
    setTotalOdds(total);
    console.log("Your Combine");
    console.log(yourCombine);
  }, [yourCombine]);

  async function getMatches() {
    const q = query(collection(db, "matches"));
    const querySnapshot = await getDocs(q);
    const matchsArray: IMatch[] = [];
    for (const doc of querySnapshot.docs) {
      const matchsData = doc.data();

      matchsArray.push({ ...(matchsData as IMatch) });
    }
    setMatches(matchsArray);
    console.log("Matches");
    console.log(matches);
  }

  return (
    <div className="flex-jc-col">
      <Navbar/>

      <Box w={"full"} pt={45}>
        {matches.map((item) => {
          console.log(matches);
          return (
            <div>
              <Accordion  allowToggle>
                <AccordionItem>
                  <AccordionButton display={"flex"} justifyContent={"space-between"}>
                    <p className="blackText">{item.startTime}</p>
                    <p className="blackText">
                      {item.homeTeam + " - " + item.awayTeam}
                    </p>

                  
                    <HamburgerIcon color={"black"}/>
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                      <div className="oran-buttons">
                       <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
                        <Text color={"black"} fontSize={12}>Home Wins</Text>
                       <Button
                        size={"xs"}
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds?.homeWin &&
                                pick.type === "homeWin" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds.homeWin,
                              "homeWin"
                            )
                          }
                        >
                         
                        
                         {item.odds?.homeWin}
                         
                        </Button>
                       </Box>

                       <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
                        <Text color={"black"} fontSize={12}>Draw</Text>

                        <Button
                         size={"xs"}
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds?.draw &&
                                pick.type === "draw" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds?.draw,
                              "draw"
                            )
                          }
                        >
                          {item.odds?.draw}
                        </Button>

                        </Box>

                        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
                        <Text color={"black"} fontSize={12}>Away Wins</Text>
                        <Button
                         size={"xs"}
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds?.awayWin &&
                                pick.type === "awayWin" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds?.awayWin,
                              "awayWin"
                            )
                          }
                        >
                          {item.odds?.awayWin}
                        </Button>
                        </Box>

                        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
                        <Text color={"black"} fontSize={12}>2,5 Under</Text>
                        <Button
                        size={"xs"}
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds?.over &&
                                pick.type === "over" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds?.over,
                              "over"
                            )
                          }
                        >
                          {item.odds?.over}
                        </Button>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
                        <Text color={"black"} fontSize={12}>2,5 Over</Text>
                        <Button
                        size={"xs"}
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds?.under &&
                                pick.type === "under" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds?.under,
                              "under"
                            )
                          }
                        >
                          {item.odds?.under}
                        </Button>
                        </Box>
                      </div>
                    </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </Box>
      {yourCombine.length > 0 ? (
       <Accordion allowToggle>
       <AccordionItem>
        <AccordionButton>
          <Text className="blackText">Combine</Text>
        </AccordionButton>
        <AccordionPanel >
        <Box>
          <Card>
            <CardBody className="bg-green">
              <Text color={"black"} fontSize={16}>Your Combine</Text>
              {yourCombine.map((item) => {
                return (
                  <Box className="matchCard" key={item.id}>
                   
                      <Card display={"flex"} flexDirection={"row"} p={2} m={1}>
                      <Badge display={"flex"} alignItems={"center"} mr={2}>{item.pick}</Badge>
                        <Text color={"black"}>{item.teams}</Text>
                        
                          
                        
                      </Card>
                    
                  </Box>
                );
              })}
            <Badge p={1} m={1}>
              <Text color={"black"}>{"Total Odds: " + totalOdds.toFixed(2)}</Text>
            </Badge>
              <div className="publish-zone">
                <Select
                  m={1}
                  variant="filled"
                  size="sm"
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <option value={0}>Free</option>
                  <option value={100}>100 Credits</option>
                  <option value={500}>500 Credits</option>
                  <option value={1000}>1000 Credits</option>
                </Select>
                <Button m={1} size={"sm"} colorScheme="blue" onClick={onCombineHandler}>
                  PUBLISH
                </Button>
              </div>
            </CardBody>
          </Card>
        </Box>
        </AccordionPanel>
        </AccordionItem> 
       </Accordion>
      ) : (
        <div className="yourCombine"></div>
      )}
    </div>
  );
}

export default AddMatch;
