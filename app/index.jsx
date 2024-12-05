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
  // fuctie pentru click pe turneu
  const handleTournamentPress = (item) => {
    setSelectedTournament(item);
    router.push("/matches");
  };
  return (
    <SafeAreaView className="h-screen flex-1 px-4 bg-gray-950">
      <FlatList
        data={[
          {
            name: "Tournament 1",
            id: 1,
            image: "../assets/images/tournamentPic1.png",
            slug: "turneu1",
            matches: [
              {
                team1: "FCSB",
                team2: "Dinamo",
                score: [0, 0],
                result: null,
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
                score: [3, 2],
                result: 1,
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
            name: "Tournament 2",
            id: 2,
            image: "../assets/images/tournamentPic2.png",
            slug: "turneu1",
            matches: [
              {
                team1: "FC Barcelona",
                team2: "Real Madrid",
                score: [3, 0],
                result: null,
                date: "5.12.2024",
                time: "18:00",
                id: 1,
              },
              {
                team1: "Atletico Madrid",
                team2: "FC Barcelona",
                score: [3, 0],
                result: 1,
                date: "3.12.2024",
                time: "15:00",
                id: 2,
              },
            ],
          },
        ]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item) => {
          return (
            // <Animatable.View
            <TouchableOpacity
              onPress={() => handleTournamentPress(item)}
              className="w-full  h-44
              mt-12"
            >
              <Image
                // cand incarc datele pe contabo
                // source={{uri : "https://url to my piuc"}}
                source={require("../assets/images/tournamentPic1.png")}
                resizeMode="cover"
                className="w-full h-44  border-2 border-orange-300 rounded-xl"
              />
            </TouchableOpacity>

            // ></Animatable.View>
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
              Ongoing Tournaments
            </Text>
            <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default indexScreen;
