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
    const sortedTeams = selectedTournament.stats.sort(
      (a, b) => b.points - a.points
    );
  } else if (type === 2) {
    const sortedTeams = selectedTournament.stats.groups.map((group) =>
      group.sort((a, b) => b.points - a.points)
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
                <View className="flex items-center flex-row gap-4 w-5/12 justify-between">
                  {/* nr de meciuri jucate */}
                  <Text className="text-white text-lg">
                    {team.item.wins + (team.item.points % 3)}
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
                  <Text className="text-white text-lg">{team.item.points}</Text>
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
                <View className="flex items-center w-5/12 flex-row gap-4">
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
                {name} Matches
              </Text>

              <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3" />
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
                <View className="flex items-center w-5/12 flex-row gap-4">
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
                <View className="flex items-center flex-row gap-4 w-5/12 justify-between">
                  {/* nr de meciuri jucate */}
                  <Text className="text-white text-lg">
                    {team.item.wins + (team.item.points % 3)}
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
                  <Text className="text-white text-lg">{team.item.points}</Text>
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
