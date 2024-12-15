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
} from "react-native";
import { Link } from "expo-router";
import images from "../../constants/images";
import { Share } from "react-native";

const Stats = () => {
  // global context unde este salvat turneul pe care se apasa in index
  const { selectedTournament } = useTournament();

  // proprietatile turneului selectat
  const { name, slug, image, matches, type, id } =
    selectedTournament.information;

  // caz in care nu exista turneu
  if (!selectedTournament) {
    return <Text>No Tournament Selected</Text>;
  }

  if (type == 1) {
    let numberOfMatchesPlayed = 0;
    for (let i = 0; i < matches.length; i++) {
      numberOfMatchesPlayed =
        matches[i].result != null
          ? numberOfMatchesPlayed + 1
          : numberOfMatchesPlayed;
    }
    let numberOfGoals = 0;
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      numberOfGoals += selectedTournament.stats[i].goalsGiven;
    }
    let maxNumberOfGoalsTeam = 0;
    let teamWithMostGoals = "";
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      if (selectedTournament.stats[i].goalsGiven > maxNumberOfGoalsTeam)
        maxNumberOfGoalsTeam = selectedTournament.stats[i].goalsGiven;
    }
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      if (maxNumberOfGoalsTeam == selectedTournament.stats[i].goalsGiven) {
        teamWithMostGoals = selectedTournament.stats[i].name;
      }
    }
    console.log(
      "Number of played games : ",
      numberOfMatchesPlayed,
      "\n",
      "Total Goals this Tournament: ",
      numberOfGoals,
      "\n",
      "Team With most Goals : ",
      teamWithMostGoals,
      " ",
      maxNumberOfGoalsTeam
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
    <SafeAreaView className="h-full bg-gray-950  ">
      {type === 1 && (
        <View className="px-4">
          <View className="flex items-center rounded-md">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-20 h-20"
            />
          </View>
          <ImageBackground
            // source = {{uri : "https:....."} url din bucketul de file uri de pe contabo}
            source={require(`../../assets/images/tournamentPic1.png`)}
            className="mt-8 shadow-xl shadow-orange-300/20 h-48 "
          >
            <View className="w-full rounded-md  flex-1 justify-end items-end p-6">
              <TouchableOpacity
                onPress={onShare}
                className="px-6 py-2 rounded-md font-semibold bg-orange-300 border-b-4 border-b-orange-400"
              >
                <Text className="font-semibold">Share</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Text className="text-3xl font-semibold text-white mt-24">
            {name} Statistics
          </Text>
          <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
        </View>
      )}

      {type === 2 && (
        <ScrollView className="px-4">
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
              source={require(`../../assets/images/tournamentPic2.png`)}
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
              {name} Matches
            </Text>
            <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Stats;
