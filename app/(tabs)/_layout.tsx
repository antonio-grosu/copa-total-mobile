import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { HapticTab } from "@/components/HapticTab";
// import { useColorScheme } from "@/hooks/useColorScheme";
import images from "@/constants/images";
export default function TabLayout() {
  // const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FDBA74",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // Use a transparent background on iOS to show the blur effect
          backgroundColor: "#030712",
          position: "absolute",
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? images.primaryFootball : images.football}
              className="w-10 h-10 mb-3"
            ></Image>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? images.primaryLeaderboard : images.leaderboard}
              className="w-10 h-10 mb-3"
            ></Image>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistics",
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? images.primaryStats : images.stats}
              className="w-10 h-10 mb-3"
            ></Image>
          ),
        }}
      />
    </Tabs>
  );
}
