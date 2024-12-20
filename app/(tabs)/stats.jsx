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

  let numberOfMatchesPlayed = 0;
  let numberOfGoals = 0;
  let maxNumberOfGoalsTeam = 0;
  let teamWithMostGoals = "";
  let tournamentStats = [];
  if (type == 1) {
    for (let i = 0; i < matches.length; i++) {
      numberOfMatchesPlayed =
        matches[i].result != null
          ? numberOfMatchesPlayed + 1
          : numberOfMatchesPlayed;
    }
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      numberOfGoals += selectedTournament.stats[i].goalsGiven;
    }
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      if (selectedTournament.stats[i].goalsGiven > maxNumberOfGoalsTeam)
        maxNumberOfGoalsTeam = selectedTournament.stats[i].goalsGiven;
    }
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      if (maxNumberOfGoalsTeam == selectedTournament.stats[i].goalsGiven) {
        teamWithMostGoals = selectedTournament.stats[i].name;
      }
    }
  } else {
    selectedTournament.stats.groups.map((group) => {
      let currentStats = new Object();
      currentStats.numberOfMatchesPlayed = 0;
      currentStats.numberOfGoals = 0;
      currentStats.maxNumberOfGoalsTeam = 0;
      currentStats.teamWithMostGoals = "";
      for (let i = 0; i < group.length; i += 1) {
        currentStats.numberOfGoals += group[i].goalsGiven;
      }
      for (let i = 0; i < group.length; i += 1) {
        if (group[i].goalsGiven > currentStats.maxNumberOfGoalsTeam)
          currentStats.maxNumberOfGoalsTeam = group[i].goalsGiven;
      }
      for (let i = 0; i < group.length; i += 1) {
        if (currentStats.maxNumberOfGoalsTeam == group[i].goalsGiven) {
          currentStats.teamWithMostGoals = group[i].name;
        }
      }
      tournamentStats.push(currentStats);
    });
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
        <ScrollView className="px-4">
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
          <View className="mt-12 w-full bg-gray-500/10 p-12 rounded-md flex items-center justify-center">
            <Text className="text-white  text-xl ">
              <Text className="font-semibold text-2xl text-orange-300">
                {numberOfMatchesPlayed}
              </Text>{" "}
              Games played
            </Text>
          </View>
          <View className="flex items-center mt-4 justify-between gap-4 w-full flex-row">
            <View className="w-4/12 p-4 bg-gray-500/10 rounded-md items-center">
              <Text className="text-md text-white">Total Goals</Text>
              <Text className="text-md mt-2 text-2xl font-semibold text-orange-300">
                {numberOfGoals}
              </Text>
            </View>
            <View className="w-7/12 p-4 items-center bg-gray-500/10 rounded-md">
              <Text className="text-white ">
                <Text className="font-semibold">{teamWithMostGoals} </Text>
              </Text>
              <View className="flex items-center mt-2 justify-center flex-row gap-2">
                <Image
                  source={images.primaryFootball}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
                <Text className="text-2xl text-orange-300 font-semibold">
                  {maxNumberOfGoalsTeam}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
            <View className="px-2 py-4 bg-yellow-400 rounded-sm"></View>
            <Text className="font-semibold text-2xl  text-orange-300">
              No.{" "}
            </Text>
          </View>
          <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
            <View className="px-2 py-4 bg-red-500 rounded-sm"></View>
            <Text className="font-semibold text-2xl  text-orange-300">
              No.{" "}
            </Text>
          </View>
        </ScrollView>
      )}

      {type === 2 && (
        <SectionList
          className="px-4"
          sections={tournamentStats.map((stats, index) => ({
            title: `Group ${index + 1}`,
            data: [stats],
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="mt-4 w-full bg-gray-500/10 p-12 rounded-md flex items-center justify-center">
              <Text className="text-white text-xl">
                <Text className="font-semibold text-2xl text-orange-300">
                  {item.numberOfMatchesPlayed}
                </Text>{" "}
                Games played
              </Text>
              <View className="flex items-center mt-4 justify-between gap-4 w-full flex-row">
                <View className="w-4/12 p-4 bg-gray-500/10 rounded-md items-center">
                  <Text className="text-md text-white">Total Goals</Text>
                  <Text className="text-md mt-2 text-2xl font-semibold text-orange-300">
                    {item.numberOfGoals}
                  </Text>
                </View>
                <View className="w-7/12 p-4 items-center bg-gray-500/10 rounded-md">
                  <Text className="text-white">
                    <Text className="font-semibold">
                      {item.teamWithMostGoals}{" "}
                    </Text>
                  </Text>
                  <View className="flex items-center mt-2 justify-center flex-row gap-2">
                    <Image
                      source={images.primaryFootball}
                      resizeMode="contain"
                      className="w-6 h-6"
                    />
                    <Text className="text-2xl text-orange-300 font-semibold">
                      {item.maxNumberOfGoalsTeam}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
                <View className="px-2 py-4 bg-yellow-500 rounded-sm"></View>
                <Text className="font-semibold text-2xl  text-orange-300">
                  No.{" "}
                </Text>
              </View>
              <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
                <View className="px-2 py-4 bg-red-500 rounded-sm"></View>
                <Text className="font-semibold text-2xl  text-orange-300">
                  No.{" "}
                </Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-2xl font-semibold text-white mt-8">
              {title}
            </Text>
          )}
          ListHeaderComponent={() => (
            <>
              <View className="flex items-center rounded-md">
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  className="w-20 h-20"
                />
              </View>
              <ImageBackground
                // source = {{uri : "https:....."} url din bucketul de file uri de pe contabo}
                source={require(`../../assets/images/tournamentPic2.png`)}
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
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Stats;
