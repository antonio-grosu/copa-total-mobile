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
  const { name, slug, image, matches, id } = selectedTournament.item;

  // caz in care nu exista turneu
  if (!selectedTournament) {
    return <Text>No Tournament Selected</Text>;
  }
  return (
    <SafeAreaView className="h-full bg-gray-950 ">
      <FlatList
        className="px-4"
        data={matches}
        // render box ul cu meciul
        renderItem={() => null}
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
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default Stats;
