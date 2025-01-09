import { useTournament } from "../TournamentContextProvider";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  SectionList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { Share } from "react-native";

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
  const { name, slug, image, matches, id, type } =
    selectedTournament.information;
  let groups = selectedTournament.information.matches
    ? selectedTournament.information.matches
    : [];
  let semifinals = [];
  let finals = [];
  if (type === 1) {
    // proprietatile turneului selectat

    // sortarea in ordine descrescatoare a meciurilor in functie de data
    matches.sort((a, b) => {
      // Convert dates from DD.MM.YYYY to YYYY-MM-DD for parsing
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));
      return dateB - dateA; // Ascending order
    });
  }
  if (type == 2) {
    groups = selectedTournament.information.matches.groups
      ? selectedTournament.information.matches.groups
      : [];
    semifinals = selectedTournament.information.matches.semifinals
      ? selectedTournament.information.matches.semifinals
      : [];
    finals = selectedTournament.information.matches.finals
      ? selectedTournament.information.matches.finals
      : [];
    groups.map((group) => {
      group.sort((a, b) => {
        // Convert dates from DD.MM.YYYY to YYYY-MM-DD for parsing
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateB - dateA; // Ascending order
      });
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
    <SafeAreaView className="h-full flex flex-1 bg-gray-950 ">
      {/* render pentru tipul campionat */}

      {type === 1 && (
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
                  className="w-full rounded-md border-2 py-4 px-8 border-gray-300/10 h-40 flex-row"
                >
                  <View className="flex-1 w-5/12 justify-center gap-4 ">
                    <View
                      className={
                        match.item.score[0] > match.item.score[1]
                          ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                          : `text-white px-4 py-1  text-lg`
                      }
                    >
                      <Text
                        className={
                          match.item.score[0] > match.item.score[1]
                            ? " text-white font-semibold text-lg"
                            : `text-white text-lg`
                        }
                      >
                        {match.item.team1}
                      </Text>
                    </View>

                    <View
                      className={
                        match.item.score[0] < match.item.score[1]
                          ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                          : `text-white  px-4 py-1  text-lg`
                      }
                    >
                      <Text
                        className={
                          match.item.score[0] < match.item.score[1]
                            ? "text-white font-semibold text-lg"
                            : `text-white  text-lg`
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
                {name} Matches
              </Text>
              <View className="w-1/2 pt-1 rounded-full bg-orange-300 mt-3"></View>
            </View>
          )}
        ></FlatList>
      )}
      {/*     
    conditonal render doar pentru grupe */}
      {type === 2 && semifinals.length == 0 && (
        <SectionList
          stickySectionHeadersEnabled={false} // Disable sticky headers
          // definesc sectiunile care apar sub forma de liste
          sections={groups.map((group, index) => ({
            title: `Group ${index + 1}`,
            data: group,
          }))}
          keyExtractor={(item, index) => `match-${index}`}
          // header-ul fiecarei sectiuni
          renderSectionHeader={({ section }) => (
            <Text className="text-2xl mt-16 font-semibold  text-white">
              {section.title}
            </Text>
          )}
          //fiecare element din sectiune
          renderItem={({ item: match }) => (
            <View>
              <Text className="text-white mt-12 mb-2">{match.date}</Text>
              {/* cardul de meci */}
              <View
                key={match.id}
                className="w-full rounded-md border-2 py-4 px-8 border-gray-300/10 h-32 flex-row"
              >
                <View className="flex-1 w-5/12 justify-center gap-4">
                  <View
                    className={
                      match.score[0] > match.score[1]
                        ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                        : `text-white px-4 py-1  text-lg`
                    }
                  >
                    <Text
                      className={
                        match.score[0] > match.score[1]
                          ? "text-white font-bold text-lg"
                          : `text-white  text-lg`
                      }
                    >
                      {match.team1}
                    </Text>
                  </View>
                  <View
                    className={
                      match.score[0] < match.score[1]
                        ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                        : `text-white px-4 py-1  text-lg`
                    }
                  >
                    <Text
                      className={
                        match.score[0] < match.score[1]
                          ? "text-white font-bold text-lg"
                          : `text-white  text-lg`
                      }
                    >
                      {match.team2}
                    </Text>
                  </View>
                </View>
                <View className="w-6/12 justify-end items-end">
                  <View className="flex-row gap-4 flex-1">
                    <View className="flex-col items-center justify-center gap-4 border-r-2 px-4 border-gray-100/30">
                      <Text
                        className={
                          match.score[0] > match.score[1]
                            ? "text-green-300 font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.score[0]}
                      </Text>
                      <Text
                        className={
                          match.score[0] < match.score[1]
                            ? "text-green-300 font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.score[1]}
                      </Text>
                    </View>
                    <View className="p-1 flex items-center justify-center">
                      <Text className="text-white font-semibold">
                        {match.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
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
          className="px-4"
        />
      )}
      {/* conditional render pentru semifinale si finale */}
      {type === 2 && semifinals.length > 0 && (
        <SectionList
          stickySectionHeadersEnabled={false} // Disable sticky headers
          // definesc sectiunile care apar sub forma de liste
          sections={groups.map((group, index) => ({
            title: `Group ${index + 1}`,
            data: group,
          }))}
          keyExtractor={(item, index) => `match-${index}`}
          // header-ul fiecarei sectiuni
          renderSectionHeader={({ section }) => (
            <Text className="text-2xl mt-16 font-semibold  text-white">
              {section.title}
            </Text>
          )}
          //fiecare element din sectiune
          renderItem={({ item: match }) => (
            <View>
              <Text className="text-white mt-12 mb-2">{match.date}</Text>
              {/* cardul de meci */}
              <View
                key={match.id}
                className="w-full rounded-md border-2 py-4 px-8 border-gray-300/10 h-32 flex-row"
              >
                <View className="flex-1 w-5/12 justify-center gap-4">
                  <View
                    className={
                      match.score[0] > match.score[1]
                        ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                        : `text-white px-4 py-1  text-lg`
                    }
                  >
                    <Text
                      className={
                        match.score[0] > match.score[1]
                          ? "text-white font-bold text-lg"
                          : `text-white  text-lg`
                      }
                    >
                      {match.team1}
                    </Text>
                  </View>
                  <View
                    className={
                      match.score[0] < match.score[1]
                        ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                        : `text-white px-4 py-1  text-lg`
                    }
                  >
                    <Text
                      className={
                        match.score[0] < match.score[1]
                          ? "text-white font-bold text-lg"
                          : `text-white  text-lg`
                      }
                    >
                      {match.team2}
                    </Text>
                  </View>
                </View>
                <View className="w-6/12 justify-end items-end">
                  <View className="flex-row gap-4 flex-1">
                    <View className="flex-col items-center justify-center gap-4 border-r-2 px-4 border-gray-100/30">
                      <Text
                        className={
                          match.score[0] > match.score[1]
                            ? "text-green-300 font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.score[0]}
                      </Text>
                      <Text
                        className={
                          match.score[0] < match.score[1]
                            ? "text-green-300 font-semibold text-lg"
                            : `text-white/50 font-semibold text-lg`
                        }
                      >
                        {match.score[1]}
                      </Text>
                    </View>
                    <View className="p-1 flex items-center justify-center">
                      <Text className="text-white font-semibold">
                        {match.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
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
              {finals.length > 0 && (
                <>
                  <Text className="text-2xl mt-16 font-semibold  text-white">
                    Finals
                  </Text>
                  <>
                    <Text className="text-white  mt-12 mb-2">
                      {finals[0].date}
                    </Text>
                    <View
                      key={finals[0].id}
                      className="w-full rounded-md border-2 py-4 px-8 border-gray-300/10 h-40 flex-row"
                    >
                      <View className="flex-1 w-5/12 justify-center gap-4 ">
                        <View
                          className={
                            finals[0].score[0] > finals[0].score[1]
                              ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                              : `text-white px-4 py-1  text-lg`
                          }
                        >
                          <Text
                            className={
                              finals[0].score[0] > finals[0].score[1]
                                ? " text-white font-semibold text-lg"
                                : `text-white text-lg`
                            }
                          >
                            {finals[0].team1}
                          </Text>
                        </View>

                        <View
                          className={
                            finals[0].score[0] < finals[0].score[1]
                              ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                              : `text-white  px-4 py-1  text-lg`
                          }
                        >
                          <Text
                            className={
                              finals[0].score[0] < finals[0].score[1]
                                ? "text-white font-semibold text-lg"
                                : `text-white  text-lg`
                            }
                          >
                            {finals[0].team2}
                          </Text>
                        </View>
                      </View>
                      <View className="w-6/12  justify-end items-end">
                        <View className="flex-row gap-4   flex-1">
                          <View className="flex-col items-center justify-center gap-4 border-r-2 px-4 border-gray-100/30">
                            <Text
                              className={
                                finals[0].score[0] > finals[0].score[1]
                                  ? "text-green-300 font-semibold text-lg"
                                  : `text-white/50 font-semibold text-lg`
                              }
                            >
                              {finals[0].score[0]}
                            </Text>
                            <Text
                              className={
                                finals[0].score[0] < finals[0].score[1]
                                  ? "text-green-300 font-semibold text-lg"
                                  : `text-white/50 font-semibold text-lg`
                              }
                            >
                              {finals[0].score[1]}
                            </Text>
                          </View>
                          <View className=" p-1 flex items-center justify-center ">
                            <Text className="text-white font-semibold">
                              {finals[0].time}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                </>
              )}
              {/* renderul rezultatelor din semifinale */}
              <Text className="text-2xl mt-16 font-semibold  text-white">
                Semifinals
              </Text>
              <FlatList
                data={semifinals}
                // render box ul cu meciul
                renderItem={(match) => {
                  return (
                    <>
                      <Text className="text-white  mt-12 mb-2">
                        {match.item.date}
                      </Text>
                      <View
                        key={match.item.id}
                        className="w-full rounded-md border-2 py-4 px-8 border-gray-300/10 h-40 flex-row"
                      >
                        <View className="flex-1 w-5/12 justify-center gap-4 ">
                          <View
                            className={
                              match.item.score[0] > match.item.score[1]
                                ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                                : `text-white px-4 py-1  text-lg`
                            }
                          >
                            <Text
                              className={
                                match.item.score[0] > match.item.score[1]
                                  ? " text-white font-semibold text-lg"
                                  : `text-white text-lg`
                              }
                            >
                              {match.item.team1}
                            </Text>
                          </View>

                          <View
                            className={
                              match.item.score[0] < match.item.score[1]
                                ? "bg-green-300/40 rounded-md px-4 py-1 font-semibold text-lg"
                                : `text-white  px-4 py-1  text-lg`
                            }
                          >
                            <Text
                              className={
                                match.item.score[0] < match.item.score[1]
                                  ? "text-white font-semibold text-lg"
                                  : `text-white  text-lg`
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
              ></FlatList>
            </View>
          )}
          className="px-4"
        />
      )}
    </SafeAreaView>
  );
};

export default MatchesScreen;
