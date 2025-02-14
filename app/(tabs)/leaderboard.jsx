import { useTournament } from "../TournamentContextProvider";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { Link } from "expo-router";
import images from "../../constants/images";
import { Share } from "react-native";
import { useEffect, useState } from "react";
import { FlipOutXDown } from "react-native-reanimated";

const Leaderboard = () => {
  // global context unde este salvat turneul pe care se apasa in index
  const { selectedTournament } = useTournament();

  // proprietatile turneului selectat
  const { name, slug, image, matches, type, id } =
    selectedTournament.information;

  // array-ul de stats ( sortat in functie de rezultatele echipelor)
  const teamsStats = selectedTournament.stats;
  // caz in care nu exista turneu
  if (!selectedTournament) {
    return <Text>No Tournament Selected</Text>;
  }
  if (type === 1) {
    let sortedTeams = selectedTournament.stats.sort((a, b) => {
      if (b.points === a.points) {
        let golAverajA = a.goalsReceived
          ? a.goalsGiven / a.goalsReceived
          : a.goalsGiven;
        let golAverajB = b.goalsReceived
          ? b.goalsGiven / b.goalsReceived
          : b.goalsGiven;
        return golAverajB - golAverajA;
      }
      return b.points - a.points;
    });
  } else if (type === 2) {
    const sortedTeamsGroups = selectedTournament.stats.groups.map((group) =>
      group.sort((a, b) => {
        if (b.points === a.points) {
          let golAverajA = a.goalsReceived
            ? a.goalsGiven / a.goalsReceived
            : a.goalsGiven;
          let golAverajB = b.goalsReceived
            ? b.goalsGiven / b.goalsReceived
            : b.goalsGiven;
          return golAverajB - golAverajA;
        }
        return b.points - a.points;
      })
    );
    let sortedTeamsSemifinals = selectedTournament.stats.semifinals.sort(
      (a, b) => b.points - a.points
    );
    sortedTeamsSemifinals = sortedTeamsSemifinals.sort(
      (a, b) => b.gamesPlayed - a.gamesPlayed
    );
  }
  // functie de share
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "View Real-Time results from Copa Total championships and tournaments!",
        title: "Copa Total App",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with specific activity type (iOS)
          console.log("Shared with activity type:", result.activityType);
        } else {
          // Shared successfully
          console.log("Shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dismissed.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <SafeAreaView className="h-full bg-gray-950 ">
      {/* componenta pentru campionat */}
      {type == 1 && (
        <FlatList
          className="px-4"
          data={teamsStats}
          // render box ul cu meciul
          renderItem={(team) => {
            return (
              <View
                className={
                  team.index % 2 == 1
                    ? "w-full px-2 py-2 mt-4 flex flex-row items-center justify-between"
                    : "w-full px-2 py-2 bg-gray-500/10  mt-4 flex flex-row items-center justify-between"
                }
              >
                <View className="flex gap-4  flex-row items-center">
                  {/* locul in clasament */}
                  <Text className="text-white">{team.index + 1}</Text>
                  {/* numele echipei */}
                  <Text className="text-white text-lg font-semibold">
                    {team.item.name}
                  </Text>
                </View>
                <View className="flex items-center flex-row gap-4 w-6/12 justify-between">
                  {/* nr de meciuri jucate */}
                  <Text className="text-white text-lg">
                    {team.item.wins + team.item.losses}
                  </Text>
                  {/* nr de meciuri castigate */}
                  <Text className="text-white text-lg">{team.item.wins}</Text>
                  {/* nr de meciuri la egalitate */}
                  <Text className="text-white text-lg">
                    {team.item.points % 3}
                  </Text>
                  {/* nr de meciuri pierdute */}
                  <Text className="text-white text-lg">{team.item.losses}</Text>
                  {/* nr de puncte */}
                  <Text className="text-white text-lg">{team.item.points}</Text>
                  {/* nr de puncte */}
                  <Text className="text-white text-lg">
                    {team.item.goalsReceived
                      ? team.item.goalsGiven / team.item.goalsReceived
                      : team.item.goalsGiven}
                  </Text>
                </View>
              </View>
            );
          }}
          //render la componentele de deasupra meciurilor
          ListHeaderComponent={() => (
            <View>
              <View className="flex items-center rounded-md">
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  className="w-20 h-20 "
                />
              </View>
              <ImageBackground
                // source = {{uri : "https:....."} url din bucketul de file uri de pe contabo}
                source={require(`../../assets/images/tournamentPic1.png`)}
                className="mt-8 shadow-xl shadow-orange-300/20 "
              >
                <View className="w-full rounded-md h-48 flex-1 justify-end items-end p-6">
                  <TouchableOpacity
                    onPress={onShare}
                    className="px-6 py-2 rounded-md font-semibold bg-orange-300 border-b-4 border-b-orange-400"
                  >
                    <Text className="font-semibold">Share</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <Text className="text-3xl font-semibold text-white mt-24">
                {name} Leaderboard
              </Text>
              <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
              <View className="w-full px-2 mt-8 flex items-center flex-row justify-between">
                <View className="flex flex-row items-center gap-4">
                  <Text className="text-white text-xl font-semibold">#</Text>
                  <Text className="text-white text-xl font-semibold">Team</Text>
                </View>
                <View className="flex justify-between items-center w-6/12 flex-row gap-4">
                  <Text className="text-white text-xl font-semibold">P</Text>
                  <Text className="text-white text-xl font-semibold">W</Text>
                  <Text className="text-white text-xl font-semibold">D</Text>
                  <Text className="text-white text-xl font-semibold">L</Text>
                  <Text className="text-white text-xl font-semibold">PTS</Text>
                  <Text className="text-white text-xl font-semibold">G</Text>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      )}
      {/* componenta pentru turneu */}

      {type === 2 && (
        <SectionList
          className="px-4"
          ListHeaderComponent={() => (
            <View>
              <View className="flex items-center rounded-md">
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  className="w-20 h-20"
                />
              </View>
              <ImageBackground
                source={require("../../assets/images/tournamentPic2.png")}
                className="mt-8 shadow-xl shadow-orange-300/20"
              >
                <View className="w-full rounded-md h-48 flex-1 justify-end items-end p-6">
                  <TouchableOpacity
                    onPress={onShare}
                    className="px-6 py-2 rounded-md font-semibold bg-orange-300 border-b-4 border-b-orange-400"
                  >
                    <Text className="font-semibold">Share</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <Text className="text-3xl font-semibold text-white mt-24">
                {name} Leaderboard
              </Text>
              <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3" />
              {/* componenta de afisare a leaderboardului  din finala */}
              {teamsStats.finals.length > 0 && (
                <Text className="mt-12 font-semibold text-2xl mb-4 text-white">
                  Finals
                </Text>
              )}
              {teamsStats.finals.length > 0 && !teamsStats.finals[0].result && (
                <Text className="text-white  mx-auto mt-4">Not Played</Text>
              )}
              {teamsStats.finals.length > 0 && teamsStats.finals[0].result && (
                <>
                  <View className="w-full h-20 relative flex flex-row items-center justify-center">
                    <Image
                      source={require("../../assets/images/trophy.png")}
                      resizeMode="contain"
                      className="h-16 w-16"
                    />
                    <View className=" flex flex-row items-center justify-center">
                      <Text className="text-white text-2xl font-semibold">
                        {teamsStats.finals[0].result === 1
                          ? teamsStats.finals[0].team1
                          : teamsStats.finals[0].team2}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white  mx-auto mt-4">
                    2.{" "}
                    {teamsStats.finals[0].result === 1
                      ? teamsStats.finals[0].team2
                      : teamsStats.finals[0].team1}
                  </Text>
                </>
              )}

              {/* componenta de afisare a leaderboardului  din semifinale */}
              {teamsStats.semifinals.length > 0 && (
                <Text className="mt-12 font-semibold text-2xl mb-4 text-white">
                  Semifinals
                </Text>
              )}
              {teamsStats.semifinals.length > 0 &&
                teamsStats.semifinals.map((team, index) => {
                  return (
                    <View
                      key={index}
                      className="flex justify-center flex-row items-center  gap-2 text-lg "
                    >
                      {team.wins == 1 && (
                        <Text className="text-green-300 mb-2 w-3/12 text-right ">
                          Qualified
                        </Text>
                      )}
                      {team.losses > 0 && (
                        <Text className="text-red-500 mb-2 w-3/12 text-right ">
                          Lost Semifinals
                        </Text>
                      )}
                      {team.wins == 0 && team.losses == 0 && (
                        <Text className="text-gray-500 mb-2 w-3/12 text-right ">
                          Not Played
                        </Text>
                      )}
                      <Text className="text-white font-semibold text-lg mb-2 w-3/12 text-left">
                        {team.name}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}
          stickySectionHeadersEnabled={false} // Disable sticky headers
          // definesc sectiunile care apar sub forma de liste
          sections={teamsStats.groups.map((group, index) => ({
            title: `Group ${index + 1}`,
            data: group,
          }))}
          keyExtractor={(item, index) => `match-${index}`}
          // header-ul fiecarei sectiuni
          renderSectionHeader={({ section }) => (
            <>
              <Text className="text-2xl mt-16 font-semibold  text-white">
                {section.title}
              </Text>
              <View className="w-full px-2 mt-8 flex items-center flex-row justify-between">
                <View className="flex flex-row items-center gap-4">
                  <Text className="text-white text-xl font-semibold">#</Text>
                  <Text className="text-white text-xl font-semibold">Team</Text>
                </View>
                <View className="flex justify-between items-center w-6/12 flex-row gap-4">
                  <Text className="text-white text-xl font-semibold">P</Text>
                  <Text className="text-white text-xl font-semibold">W</Text>
                  <Text className="text-white text-xl font-semibold">D</Text>
                  <Text className="text-white text-xl font-semibold">L</Text>
                  <Text className="text-white text-xl font-semibold">PTS</Text>
                  <Text className="text-white text-xl font-semibold">G</Text>
                </View>
              </View>
            </>
          )}
          renderItem={(team) => {
            return (
              <View
                className={
                  team.index % 2 == 1
                    ? "w-full px-2 py-2 mt-4 flex flex-row items-center justify-between"
                    : "w-full px-2 py-2 bg-gray-500/10  mt-4 flex flex-row items-center justify-between"
                }
              >
                <View className="flex gap-4  flex-row items-center">
                  {/* locul in clasament */}
                  <Text className="text-white">{team.index + 1}</Text>
                  {/* numele echipei */}
                  <Text className="text-white text-lg font-semibold">
                    {team.item.name}
                  </Text>
                </View>
                <View className="flex items-center flex-row gap-4 w-6/12 justify-between">
                  {/* nr de meciuri jucate */}
                  <Text className="text-white text-lg">
                    {team.item.wins + team.item.losses}
                  </Text>
                  {/* nr de meciuri castigate */}
                  <Text className="text-white text-lg">{team.item.wins}</Text>
                  {/* nr de meciuri la egalitate */}
                  <Text className="text-white text-lg">
                    {team.item.points % 3}
                  </Text>
                  {/* nr de meciuri pierdute */}
                  <Text className="text-white text-lg">{team.item.losses}</Text>
                  {/* nr de puncte */}
                  <Text className="text-white text-lg">{team.item.points}</Text>
                  {/* nr de puncte */}
                  <Text className="text-white text-lg">
                    {team.item.goalsReceived
                      ? team.item.goalsGiven / team.item.goalsReceived
                      : team.item.goalsGiven}
                  </Text>
                </View>
              </View>
            );
          }}
        ></SectionList>
      )}
    </SafeAreaView>
  );
};

export default Leaderboard;
