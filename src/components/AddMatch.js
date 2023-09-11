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
} from "@chakra-ui/react";

import { MainContext, useContext } from "../context/Context";

import Navbar from "./Navbar";
import "../App.css";

function AddMatch() {
  const [matches, setMatches] = useState([]);
  const [yourCombine, setYourCombine] = useState([]);
  const [totalOdds, setTotalOdds] = useState("");
  const [credit, setCredit] = useState(0);

  const { id, username } = useContext(MainContext);

  function handlePick(matchId, matchTeams, oddsValue, oddsType) {
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

    const sortedCombine = updatedCombines.sort((a, b) => b.id - a.id);
    setYourCombine(sortedCombine);
  }

  useEffect(() => {
    getMatches();
  }, []);

  function handleChange(value) {
    return setCredit(value);
  }

  async function onCombineHandler(e) {
    e.preventDefault();
    // alert(tweet);

    // Dökümanı ekle ve geriye dönen referansı al

    // Dökümanı ekle ve geriye dönen referansı al
    const docRef = await addDoc(collection(db, "combines"), {
      username: username,
      tweet: yourCombine,
      sender: id,
      timestamp: Timestamp.fromMillis(Date.now()),
      likedUsers: [],
      boughtUsers: [],
      credit: credit,
    });

    // Oluşturulan dökümanın ID'sini al
    const generatedID = docRef.id;

    // Bu ID'yi dökümanın içeriğine ekleyin
    await setDoc(docRef, { id: generatedID }, { merge: true });

    setYourCombine([]);
  }

  useEffect(() => {
    const total = yourCombine.reduce((accumulator, currentItem) => {
      return accumulator * parseFloat(currentItem.pick);
    }, 1);
    setTotalOdds(total.toFixed(2));
  }, [yourCombine]);

  async function getMatches() {
    const q = query(collection(db, "matches"));
    const querySnapshot = await getDocs(q);
    const matchsArray = [];
    for (const doc of querySnapshot.docs) {
      const matchsData = doc.data();

      matchsArray.push({ ...matchsData });
    }
    setMatches(matchsArray);
  }

  return (
    <div className="addMatchContainer">
      <div className="fixed">
        <Navbar />
      </div>
      <div className="addMatch">
        <Box>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Time</Th>
                  <Th>Teams</Th>
                  <Th isNumeric>1</Th>
                  <Th isNumeric>0</Th>
                  <Th isNumeric>2</Th>
                  <Th isNumeric>2,5 Over</Th>
                  <Th isNumeric>2,5 Under</Th>
                </Tr>
              </Thead>

              {matches.map((item) => {
                return (
                  <Thead>
                    <Tr>
                      <Th>{item.startTime}</Th>
                      <Th>{item.homeTeam + " - " + item.awayTeam}</Th>
                      <Th isNumeric>
                        <Button
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds.homeWin &&
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
                          {item.odds.homeWin}
                        </Button>
                      </Th>
                      <Th isNumeric>
                        <Button
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds.draw &&
                                pick.type === "draw" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds.draw,
                              "draw"
                            )
                          }
                        >
                          {item.odds.draw}
                        </Button>
                      </Th>
                      <Th isNumeric>
                        <Button
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds.awayWin &&
                                pick.type === "awayWin" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds.awayWin,
                              "awayWin"
                            )
                          }
                        >
                          {item.odds.awayWin}
                        </Button>
                      </Th>
                      <Th isNumeric>
                        <Button
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds.over &&
                                pick.type === "over" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds.over,
                              "over"
                            )
                          }
                        >
                          {item.odds.over}
                        </Button>
                      </Th>
                      <Th isNumeric>
                        <Button
                          className={`oran ${
                            yourCombine.some(
                              (pick) =>
                                pick.id === item.id &&
                                pick.pick === item.odds.under &&
                                pick.type === "under" // Oranın türünü kontrol edin
                            )
                              ? "bg-green"
                              : "oran"
                          }`}
                          onClick={() =>
                            handlePick(
                              item.id,
                              item.homeTeam + "-" + item.awayTeam,
                              item.odds.under,
                              "under"
                            )
                          }
                        >
                          {item.odds.under}
                        </Button>
                      </Th>
                    </Tr>
                  </Thead>
                );
              })}
            </Table>
          </TableContainer>
        </Box>
        {yourCombine.length > 0 ? (
          <div className="yourCombine">
            <Card>
              <CardBody className="bg-green">
                <Text className="title-text">Your Combine</Text>
                {yourCombine.map((item) => {
                  return (
                    <div className="matchCard" key={item.id}>
                      <Card m={2} className="bg-grey">
                        <CardBody>
                          {item.teams}
                          <div>
                            <p>{item.pick}</p>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  );
                })}
                <Card className="mt-3" m={2}>
                  <CardFooter>{"Total Odds: " + totalOdds}</CardFooter>
                </Card>
                <div className="publish-zone">
                  <Select
                    m={2}
                    variant="filled"
                    size="md"
                    onChange={(e) => handleChange(e.target.value)}
                  >
                    <option value={0}>Free</option>
                    <option value={100}>100 Credit</option>
                    <option value={500}>500 Credit</option>
                    <option value={1000}>1000 Credit</option>
                  </Select>
                  <Button m={2} colorScheme="blue" onClick={onCombineHandler}>
                    PUBLISH
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : (
          <div className="yourCombine"></div>
        )}
      </div>
    </div>

    /* <div className="matchList">
      <div className="yourCombine">
        <p>Your Combine</p>
        {"Total Odds: " + totalOdds}
        {yourCombine.map((item) => {
          return (
            <div className="matchCard" key={item.id}>
              <div className="singleMatch">
                <div>{item.teams}</div>
                <div>
                  <p>{item.pick}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <button onClick={getMatches}>Get Matches</button>
        {matches.map((item) => {
          return (
            <div className="matchCard" key={item.id}>
              <div>{item.homeTeam + "-" + item.awayTeam}</div>
              <div>
                <button
                  onClick={() =>
                    handlePick(
                      item.id,
                      item.homeTeam + "-" + item.awayTeam,
                      item.odds.homeWin
                    )
                  }
                >
                  {item.odds.homeWin}
                </button>
                <button
                  onClick={() =>
                    handlePick(
                      item.id,
                      item.homeTeam + "-" + item.awayTeam,
                      item.odds.draw
                    )
                  }
                >
                  {item.odds.draw}
                </button>
                <button
                  onClick={() =>
                    handlePick(
                      item.id,
                      item.homeTeam + "-" + item.awayTeam,
                      item.odds.awayWin
                    )
                  }
                >
                  {item.odds.awayWin}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>*/
  );
}

export default AddMatch;
