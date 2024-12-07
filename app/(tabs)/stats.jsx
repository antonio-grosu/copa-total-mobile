import { useTournament } from "../TournamentContextProvider";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import images from "../../constants/images";

const Stats = () => {
  // global context unde este salvat turneul pe care se apasa in index
  const { selectedTournament } = useTournament();

  // proprietatile turneului selectat
  const { name, slug, image, matches, id } = selectedTournament.tournament;

  // caz in care nu exista turneu
  if (!selectedTournament) {
    return <Text>No Tournament Selected</Text>;
  }
  let numberOfMatchesPlayed = 0;
  for (let i = 0; i < selectedTournament.tournament.matches.length; i++) {
    numberOfMatchesPlayed =
      selectedTournament.tournament.matches[i].result != null
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

  return (
    <SafeAreaView className="h-full bg-gray-950  ">
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
            <Link
              href="https://blooming-solutions.ro"
              className="px-6 py-2 rounded-md font-semibold bg-orange-300 border-b-4 border-b-orange-400"
            >
              Share
            </Link>
          </View>
        </ImageBackground>
        <Text className="text-3xl font-semibold text-white mt-24">
          {name} Statistics
        </Text>
        <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
      </View>
    </SafeAreaView>
  );
};

export default Stats;
