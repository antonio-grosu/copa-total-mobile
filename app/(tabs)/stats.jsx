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
  let numberOfYellowCards = 0;
  let numberOfRedCards = 0;
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
    for (let i = 0; i < selectedTournament.stats.length; i += 1) {
      numberOfYellowCards += selectedTournament.stats[i].yellow_cards;
      numberOfRedCards += selectedTournament.stats[i].red_cards;
    }
  } else {
    selectedTournament.stats.groups.map((group) => {
      let currentStats = new Object();
      currentStats.numberOfMatchesPlayed = 0;
      currentStats.numberOfGoals = 0;
      currentStats.maxNumberOfGoalsTeam = 0;
      currentStats.teamWithMostGoals = "";
      currentStats.numberOfYellowCards = 0;
      currentStats.numberOfRedCards = 0;
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
      for (let i = 0; i < group.length; i += 1) {
        currentStats.numberOfYellowCards += group[i].yellow_cards;
        currentStats.numberOfYellowCards += group[i].yellow_cards;
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
      {/* componenta pentru campionat */}
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
          <View className="flex items-center mt-4 justify-between gap-4 w-full flex-row">
            <View className="w-4/12 p-4 bg-gray-500/10 rounded-md items-center">
              <Text className="text-md text-white">Total Goals</Text>
              <Text className="text-md mt-2 text-2xl font-semibold text-orange-300">
                {numberOfGoals}
              </Text>
            </View>
            <View className="w-7/12 p-4 items-center bg-gray-500/10 rounded-md">
              <Text className="text-white ">
                <Text className="font-semibold">
                  {numberOfGoals > 0 ? teamWithMostGoals : ""}{" "}
                </Text>
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
              {numberOfYellowCards}{" "}
            </Text>
          </View>
          <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
            <View className="px-2 py-4 bg-red-500 rounded-sm"></View>
            <Text className="font-semibold text-2xl  text-orange-300">
              {numberOfRedCards}{" "}
            </Text>
          </View>
        </ScrollView>
      )}
      {/* componenta pentru turneu */}
      {type === 2 && (
        <SectionList
          className="px-4"
          stickySectionHeadersEnabled={false}
          sections={tournamentStats.map((stats, index) => ({
            title: `Group ${index + 1}`,
            data: [stats],
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="mt-4 w-full bg-gray-500/10 p-12 rounded-md flex items-center justify-center">
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
                      {item.numberOfGoals > 0 ? item.teamWithMostGoals : "-"}{" "}
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
                  {item.numberOfYellowCards}{" "}
                </Text>
              </View>
              <View className="w-full mt-4 py-4 bg-gray-500/10 flex items-center justify-center gap-2 rounded-md flex-row">
                <View className="px-2 py-4 bg-red-500 rounded-sm"></View>
                <Text className="font-semibold text-2xl  text-orange-300">
                  {item.numberOfRedCards}{" "}
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

              {selectedTournament.stats.finals.length > 0 &&
                selectedTournament.stats.finals[0].result &&
                selectedTournament.stats.finals[0].score && (
                  <>
                    <Text className="text-2xl mt-16 font-semibold  text-white">
                      Finals
                    </Text>
                    <View className="mt-4 w-full bg-gray-500/10 p-12 rounded-md flex items-center justify-center">
                      <Text className="text-white font-semibold text-2xl">
                        Winner of the tournament
                      </Text>
                      {selectedTournament.stats.finals[0].result === 1 && (
                        <Text className="text-orange-300 text-2xl mt-2 font-semibold">
                          {selectedTournament.stats.finals[0].team1}{" "}
                        </Text>
                      )}
                      {selectedTournament.stats.finals[0].result === 2 && (
                        <Text className="text-orange-300">
                          {selectedTournament.stats.finals[0].team2}{" "}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              {selectedTournament.stats.semifinals.length > 0 && (
                <View>
                  <Text className="text-2xl mt-16 font-semibold  text-white">
                    Semifinals
                  </Text>
                  {selectedTournament.stats.semifinals &&
                    selectedTournament.stats.semifinals.map((team, index) => (
                      <View
                        key={index}
                        className="mt-4 w-full bg-gray-500/10 p-12 rounded-md flex items-center justify-center"
                      >
                        <View className="text-white text-xl flex flex-row items-center justify-between w-full">
                          <Text className="font-semibold text-2xl text-orange-300">
                            {team.name}
                          </Text>
                          {team.points === 3 &&
                            team.wins === 1 &&
                            team.losses === 0 && (
                              <Text className="font-semibold w-auto text-right text-green-300">
                                Qualified for the finals
                              </Text>
                            )}
                          {team.points === 0 && team.losses === 1 && (
                            <Text className="font-semibold text-right text-red-500">
                              Lost Semifinals
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Stats;
