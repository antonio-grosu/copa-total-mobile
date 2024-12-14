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
// const tournamentImages = {
//   image1: ,
// };

const MatchesScreen = () => {
  // global context unde este salvat turneul pe care se apasa in index
  const { selectedTournament } = useTournament();

  // caz in care nu exista turneu
  if (!selectedTournament) {
    return <Text>No Tournament Selected</Text>;
  }

  // proprietatile turneului selectat
  const { name, slug, image, matches, id, type } =
    selectedTournament.tournament;
  if (type == 1) {
    // sortarea in ordine descrescatoare a meciurilor in functie de data
    matches.sort((a, b) => {
      // Convert dates from DD.MM.YYYY to YYYY-MM-DD for parsing
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));
      return dateB - dateA; // Ascending order
    });
  } else {
    const groups = matches.groups;
    const semifinals = matches.semifinals;
    const finals = matches.finals;
    console.log(groups, semifinals, finals);
  }

  return (
    <SafeAreaView className="h-full bg-gray-950 ">
      {/* render pentru tipul campionat */}
      {type == 1 && (
        <FlatList
          className="px-4"
          data={matches}
          // render box ul cu meciul
          renderItem={(match) => {
            return (
              <>
                <Text className="text-white  mt-12 mb-2">
                  {match.item.date}
                </Text>
                <View
                  key={match.item.id}
                  className="w-full rounded-md border-2 py-4 px-8 border-gray-100/30 h-32 flex-row"
                >
                  <View className="flex-1 w-5/12 justify-center gap-4 ">
                    <View
                      className={
                        match.item.score[0] > match.item.score[1]
                          ? "bg-green-300/10 rounded-md px-4 py-1 font-semibold text-lg"
                          : `text-white/50 px-4 py-1 font-semibold text-lg`
                      }
                    >
                      <Text
                        className={
                          match.item.score[0] > match.item.score[1]
                            ? " text-white font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.item.team1}
                      </Text>
                    </View>
                    <View
                      className={
                        match.item.score[0] < match.item.score[1]
                          ? "bg-green-300/10 rounded-md px-4 py-1 font-semibold text-lg"
                          : `text-white/50  px-4 py-1 font-semibold text-lg`
                      }
                    >
                      <Text
                        className={
                          match.item.score[0] < match.item.score[1]
                            ? "text-white font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.item.team2}
                      </Text>
                    </View>
                  </View>
                  <View className="w-6/12  justify-end items-end">
                    <View className="flex-row gap-4   flex-1">
                      <View className="flex-col items-center justify-center gap-4 border-r-2 px-4 border-gray-100/30">
                        <Text
                          className={
                            match.item.score[0] > match.item.score[1]
                              ? "text-green-300 font-semibold text-lg"
                              : `text-white/50 font-semibold text-lg`
                          }
                        >
                          {match.item.score[0]}
                        </Text>
                        <Text
                          className={
                            match.item.score[0] < match.item.score[1]
                              ? "text-green-300 font-semibold text-lg"
                              : `text-white/50 font-semibold text-lg`
                          }
                        >
                          {match.item.score[1]}
                        </Text>
                      </View>
                      <View className=" p-1 flex items-center justify-center ">
                        <Text className="text-white font-semibold">
                          {match.item.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
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
                source={require(`../../assets/images/tournamentPic2.png`)}
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
                {name} Matches
              </Text>
              <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
            </View>
          )}
        ></FlatList>
      )}
      {/* render pentru tipul turneu */}
    </SafeAreaView>
  );
};

export default MatchesScreen;
