import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { FlatList } from "react-native";
import images from "../constants/images";
import * as Animatable from "react-native-animatable";
import { Link, router } from "expo-router";
import { useTournament } from "./TournamentContextProvider";
import { ImageBackground } from "expo-image";

const indexScreen = () => {
  const { setSelectedTournament } = useTournament();
  // fuctie pentru click pe element
  const handleTournamentPress = (item) => {
    // CREAREA DE STATS in mod eficient pentru CAMPIONAT type=1

    if (item.item.type == 1) {
      let matchesArr = item.item.matches;
      let teams = [];
      // crearea listei de echipe
      for (let i = 0; i < matchesArr.length; i += 1) {
        //verificare pt fiecare din fieldurile team1 si team2
        if (!teams.includes(matchesArr[i].team1))
          teams.push(matchesArr[i].team1);
        if (!teams.includes(matchesArr[i].team2))
          teams.push(matchesArr[i].team2);
      }
      let teamsStatsArr = [];
      // crearea listei sortate
      teams.map((item) => {
        let points = 0;
        let wins = 0;
        let losses = 0;
        let draws = 0;
        let goalsGiven = 0;
        let goalsReceived = 0;

        // resultatul este fie :
        //1 -> win echipa 1
        //2 -> win echipa 2
        //0 -> draw
        //null -> meciul nu a avut loc

        // adaugarea de puncte in  functie de echipa castigatoare
        for (let i = 0; i < matchesArr.length; i += 1) {
          //cazul 1 in care echipa care a castigat este 1
          if (matchesArr[i].team1 === item) {
            goalsGiven += matchesArr[i].score[0];
            goalsReceived += matchesArr[i].score[1];
            if (matchesArr[i].result == 1) {
              points += 3;
              wins += 1;
            } else if (matchesArr[i].result == 0) {
              points += 1;
              draws += 1;
            } else {
              points = points;
              losses += 1;
            }
          }
          // cazul 2 in care echipa care a castigat este 2
          if (matchesArr[i].team2 === item) {
            goalsGiven += matchesArr[i].score[1];
            goalsReceived += matchesArr[i].score[0];
            if (matchesArr[i].result == 2) {
              points += 3;
              wins += 1;
            } else if (matchesArr[i].result == 0) {
              points += 1;
              draws += 1;
            } else {
              points = points;
              losses += 1;
            }
          }
        }

        // se creeaza obiectul care retine echipa si nr de puncte
        const teamResult = new Object();
        teamResult.name = item;
        teamResult.points = points;
        teamResult.wins = wins;
        teamResult.losses = losses;
        teamResult.goalsGiven = goalsGiven;
        teamResult.goalsReceived = goalsReceived;
        if (teamResult) {
          teamsStatsArr.push(teamResult);
        }
      });
      setSelectedTournament({ information: item.item, stats: teamsStatsArr });
    }

    // CREAREA DE STATS in mod eficient pentru TURNEU type=2
    else {
      // format pt tournament
      let groups = item.item.matches.groups;
      let teams = [];

      // crearea listei de echipe
      for (let i = 0; i < groups.length; i += 1) {
        //verificare pt fiecare din fieldurile team1 si team2
        let currentGroup = groups[i];
        let currentTeamsArr = [];
        // array ul de echipe din fiecare grupa
        for (let i = 0; i < currentGroup.length; i += 1) {
          if (!currentTeamsArr.includes(currentGroup[i].team1))
            currentTeamsArr.push(currentGroup[i].team1);
          if (!currentTeamsArr.includes(currentGroup[i].team2))
            currentTeamsArr.push(currentGroup[i].team2);
        }
        // se adauga echipele din grupa in array ul de echipe
        teams.push(currentTeamsArr);
      }

      // stats-urile fiecarei echipe din fiecare grupa
      let groupsStatsArr = [];

      // parcurgere grupe
      teams.map((item) => {
        let currentGroupStats = [];
        item.map((team) => {
          // iterez prin fiecare echipa din grupa curenta
          let points = 0;
          let wins = 0;
          let losses = 0;
          let draws = 0;
          let goalsGiven = 0;
          let goalsReceived = 0;
          groups.map((group) => {
            // iterez prin array ul de grupe
            for (let i = 0; i < group.length; i += 1) {
              // iterez prin fiecare meci din grupa curenta
              if (group[i].team1 === team) {
                // adaugarea de puncte in  functie de echipa castigatoare
                //cazul 1 in care echipa care a castigat este 1
                goalsReceived += group[i].score[1];
                goalsGiven += group[i].score[0];
                if (group[i].result == 1) {
                  wins += 1;
                  points += 3;
                } else if (group[i].result == 0) {
                  points += 1;
                  draws += 1;
                } else {
                  points = points;
                  losses += 1;
                }
              }
              // cazul 2 in care echipa care a castigat este 2
              if (group[i].team2 === team) {
                goalsGiven += group[i].score[1];
                goalsReceived += group[i].score[0];
                if (group[i].result == 2) {
                  points += 3;
                  wins += 1;
                } else if (group[i].result == 0) {
                  points += 1;
                  draws += 1;
                } else {
                  points = points;
                  losses += 1;
                }
              }
            }
          });
          // crearea obiectului de stats pt fiecare echipa
          const teamResult = new Object();
          teamResult.name = team;
          teamResult.points = points;
          teamResult.wins = wins;
          teamResult.losses = losses;
          teamResult.goalsGiven = goalsGiven;
          teamResult.goalsReceived = goalsReceived;
          if (teamResult) {
            // se adauga stats-urile echipei in arrayul corespunzator grupei
            currentGroupStats.push(teamResult);
          }
        });
        // se adauga in array ul final, array ul de stats uri ale fiecarei echipe din toate grupele
        groupsStatsArr.push(currentGroupStats);
      });

      setSelectedTournament({
        information: item.item,
        stats: { groups: groupsStatsArr },
      });
    }

    router.push("/matches");
  };
  return (
    <SafeAreaView className="h-screen flex-1 px-4 bg-gray-950">
      <FlatList
        data={[
          {
            name: "Championship Test",
            id: 1,
            type: 1,
            image: "../assets/images/tournamentPic1.png",
            matches: [
              {
                team1: "FCSB",
                team2: "Dinamo",
                score: [1, 1],
                result: 0,
                date: "5.12.2024",
                time: "18:00",
                id: 1,
              },
              {
                team1: "FCSB",
                team2: "CFR Cluj",
                score: [3, 0],
                result: 1,
                date: "3.12.2024",
                time: "15:00",
                id: 2,
              },
              {
                team1: "Dinamo",
                team2: "Craiova",
                score: [2, 3],
                result: 2,
                date: "2.12.2024",
                time: "22:00",
                id: 3,
              },
              {
                team1: "FCSB",
                team2: "Craiova",
                score: [1, 2],
                result: 2,
                date: "19.1.2024",
                time: "21:00",
                id: 4,
              },
            ],
          },
          {
            name: "Tournament Test",
            id: 2,
            type: 2,
            image: "../assets/images/tournamentPic1.png",
            matches: {
              groups: [
                [
                  {
                    team1: "FCSB",
                    team2: "Dinamo",
                    score: [1, 1],
                    result: 0,
                    date: "5.12.2024",
                    time: "18:00",
                    id: 1,
                  },
                  {
                    team1: "FCSB",
                    team2: "CFR Cluj",
                    score: [3, 0],
                    result: 1,
                    date: "3.12.2024",
                    time: "15:00",
                    id: 2,
                  },
                  {
                    team1: "Dinamo",
                    team2: "Craiova",
                    score: [2, 6],
                    result: 2,
                    date: "2.12.2024",
                    time: "22:00",
                    id: 3,
                  },
                  {
                    team1: "FCSB",
                    team2: "Craiova",
                    score: [1, 2],
                    result: 2,
                    date: "19.1.2024",
                    time: "21:00",
                    id: 4,
                  },
                ],
                [
                  {
                    team1: "FC Barcelona",
                    team2: "Real Madrid",
                    score: [1, 1],
                    result: 0,
                    date: "5.12.2024",
                    time: "18:00",
                    id: 1,
                  },
                  {
                    team1: "Real Madrid",
                    team2: "Atletico Madrid",
                    score: [3, 0],
                    result: 1,
                    date: "3.12.2024",
                    time: "15:00",
                    id: 2,
                  },
                  {
                    team1: "FC Barcelona",
                    team2: "Atletico Madrid",
                    score: [2, 3],
                    result: 2,
                    date: "2.12.2024",
                    time: "22:00",
                    id: 3,
                  },
                  {
                    team1: "Atletico Bilbao",
                    team2: "FC Barcelona",
                    score: [1, 2],
                    result: 2,
                    date: "19.1.2024",
                    time: "21:00",
                    id: 4,
                  },
                ],
              ],
              semifinals: [],
              finals: [],
            },
          },
        ]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item) => {
          return (
            <TouchableOpacity
              onPress={() => handleTournamentPress(item)}
              className="w-full h-44 p-4 border-2 border-orange-300/10 rounded-xl
              mt-12 flex-row gap-4 items-center justify-between "
            >
              <View className="w-2/12 p-2  h-full flex-1 items-center justify-center ">
                <Image
                  source={
                    item.item.type == 1
                      ? images.championshipIcon
                      : images.tournamentIcon
                  }
                  resizeMode="contain"
                  className="w-full"
                ></Image>
              </View>
              <View className="w-9/12 p-2 flex gap-4 justify-center  h-full ">
                <Text className="text-xl text-white font-semibold">
                  {item.item.name}
                </Text>
                <Text className="text-white">No. teams </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => (
          <View>
            <View className="flex items-center">
              <Image
                source={images.logo}
                resizeMode="contain"
                className="w-20 h-20"
              />
            </View>
            <Text className="text-3xl font-semibold text-white mt-24">
              Ongoing Events
            </Text>
            <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default indexScreen;
