import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { FlatList } from "react-native";
import images from "../constants/images";
import * as Animatable from "react-native-animatable";
import { Link, router } from "expo-router";
import { useTournament } from "./TournamentContextProvider";
import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";

const indexScreen = () => {
  const { setSelectedTournament } = useTournament();
  const [tournaments, setTournaments] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    fetch("http://localhost:3000/tournaments")
      .then((response) => response.json())
      .then((data) => {
        setTournaments(data);
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
    fetch("http://localhost:3000/championships")
      .then((response) => response.json())
      .then((data) => {
        setChampionships(data);
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };
  // functie de get pentru turnee si campionate
  useEffect(() => {
    fetch("http://localhost:3000/tournaments")
      .then((response) => response.json())
      .then((data) => {
        setTournaments(data);
      });
    fetch("http://localhost:3000/championships")
      .then((response) => response.json())
      .then((data) => {
        setChampionships(data);
      });
  }, []);

  // console.log(tournaments, championships);
  const eventsArr = [...tournaments, ...championships];
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
        let yellow_cards = 0;
        let red_cards = 0;

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
            yellow_cards += matchesArr[i].cards_1.yellow;
            red_cards += matchesArr[i].cards_1.red;
            if (matchesArr[i].result == 1) {
              points += 3;
              wins += 1;
            } else if (matchesArr[i].result == 0) {
              points += 1;
              draws += 1;
            } else if (matchesArr[i].result == 2) {
              points = points;
              losses += 1;
            } else points = points;
          }
          // cazul 2 in care echipa care a castigat este 2
          if (matchesArr[i].team2 === item) {
            goalsGiven += matchesArr[i].score[1];
            goalsReceived += matchesArr[i].score[0];
            yellow_cards += matchesArr[i].cards_2.yellow;
            red_cards += matchesArr[i].cards_2.red;
            if (matchesArr[i].result == 2) {
              points += 3;
              wins += 1;
            } else if (matchesArr[i].result == 0) {
              points += 1;
              draws += 1;
            } else if (matchesArr[i].result == 1) {
              points = points;
              losses += 1;
            } else points = points;
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
        teamResult.yellow_cards = yellow_cards;
        teamResult.red_cards = red_cards;

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
          let yellow_cards = 0;
          let red_cards = 0;
          groups.map((group) => {
            // iterez prin array ul de grupe
            for (let i = 0; i < group.length; i += 1) {
              // iterez prin fiecare meci din grupa curenta
              if (group[i].team1 === team) {
                // adaugarea de puncte in  functie de echipa castigatoare
                //cazul 1 in care echipa care a castigat este 1
                goalsReceived += group[i].score[1];
                goalsGiven += group[i].score[0];
                yellow_cards += group[i].cards_1.yellow;
                red_cards += group[i].cards_1.red;
                if (group[i].result == 1) {
                  wins += 1;
                  points += 3;
                } else if (group[i].result == 0) {
                  points += 1;
                  draws += 1;
                } else if (group[i].result == 2) {
                  points = points;
                  losses += 1;
                } else points = points;
              }
              // cazul 2 in care echipa care a castigat este 2
              if (group[i].team2 === team) {
                goalsGiven += group[i].score[1];
                goalsReceived += group[i].score[0];
                yellow_cards += group[i].cards_2.yellow;
                red_cards += group[i].cards_2.red;

                if (group[i].result == 2) {
                  wins += 1;
                  points += 3;
                } else if (group[i].result == 0) {
                  points += 1;
                  draws += 1;
                } else if (group[i].result == 1) {
                  points = points;
                  losses += 1;
                } else points = points;
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
          teamResult.yellow_cards = yellow_cards;
          teamResult.red_cards = red_cards;
          if (teamResult) {
            // se adauga stats-urile echipei in arrayul corespunzator grupei
            currentGroupStats.push(teamResult);
          }
        });
        // se adauga in array ul final, array ul de stats uri ale fiecarei echipe din toate grupele
        groupsStatsArr.push(currentGroupStats);
      });
      let semifinals = item.item.matches.semifinals;
      let semifinalsTeams = [];
      let semifinalsStatsArr = [];
      // crearea listei de echipe
      for (let i = 0; i < semifinals.length; i += 1) {
        //verificare pt fiecare din fieldurile team1 si team2
        if (!semifinalsTeams.includes(semifinals[i].team1))
          semifinalsTeams.push(semifinals[i].team1);
        if (!semifinalsTeams.includes(semifinals[i].team2))
          semifinalsTeams.push(semifinals[i].team2);
      }
      // stats-urile fiecarei echipe din semifinale
      semifinalsTeams.map((item) => {
        let points = 0;
        let wins = 0;
        let losses = 0;

        let goalsGiven = 0;
        let goalsReceived = 0;
        let yellow_cards = 0;
        let red_cards = 0;

        // resultatul este fie :
        //1 -> win echipa 1
        //2 -> win echipa 2
        //0 -> draw
        //null -> meciul nu a avut loc

        // adaugarea de puncte in  functie de echipa castigatoare
        for (let i = 0; i < semifinals.length; i += 1) {
          //cazul 1 in care echipa care a castigat este 1
          if (semifinals[i].team1 === item) {
            goalsGiven += semifinals[i].score[0];
            goalsReceived += semifinals[i].score[1];
            yellow_cards += semifinals[i].cards_1.yellow;
            red_cards += semifinals[i].cards_1.red;
            if (semifinals[i].result == 1) {
              points += 3;
              wins += 1;
            } else if (semifinals[i].result == 0) {
              points += 1;
            } else if (semifinals[i].result == 2) {
              points = points;
              losses += 1;
            } else points = points;
          }
          // cazul 2 in care echipa care a castigat este 2
          if (semifinals[i].team2 === item) {
            goalsGiven += semifinals[i].score[1];
            goalsReceived += semifinals[i].score[0];
            yellow_cards += semifinals[i].cards_2.yellow;
            red_cards += semifinals[i].cards_2.red;
            if (semifinals[i].result == 2) {
              points += 3;
              wins += 1;
            } else if (semifinals[i].result == 0) {
              points += 1;
            } else if (semifinals[i].result == 1) {
              points = points;
              losses += 1;
            } else points = points;
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
        teamResult.yellow_cards = yellow_cards;
        teamResult.red_cards = red_cards;

        if (teamResult) {
          semifinalsStatsArr.push(teamResult);
        }
      });

      let finals = item.item.matches.finals;

      setSelectedTournament({
        information: item.item,
        stats: {
          groups: groupsStatsArr,
          semifinals: semifinalsStatsArr,
          finals: finals,
        },
      });
    }

    router.push("/matches");
  };
  return (
    <SafeAreaView className="h-screen flex-1 px-4 bg-gray-950">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#FFA500"}
          />
        }
        data={eventsArr}
        keyExtractor={(item) => item._id.toString()}
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
