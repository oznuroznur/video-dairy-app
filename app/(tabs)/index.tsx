import React, { Fragment } from "react";
import { View, Text, StatusBar } from "react-native";
import { FlashList } from "@shopify/flash-list";
import VideoCard from "@/components/home/VideoCard";

export const DATA = [
  {
    url: require("@/assets/images/me.jpeg"),
    name: "Video 1",
    video_id: "1",
    date: "2021-09-01",
  },
  {
    url: require("@/assets/images/me.jpeg"),
    name: "Video 2",
    video_id: "2",
    date: "2021-09-02",
  },
];

const HomePage = () => {
  return (
    <View className="flex-1 mx-auto container bg-violet-50 ">
  
      <View className="flex-1 p-4">
      <Text className="text-lg font-semibold text-violet-700">
        Previously Cropped Videos
        </Text>
        <View className="h-[1] w-full bg-violet-300 my-2"/>
        <FlashList
          data={DATA}
          renderItem={({ item }) => (
            <View className="my-2 ">
              <VideoCard styles="shadow-sm" item={item} />
            </View>
          )}
          estimatedItemSize={200}
        />{" "}
      </View>
    </View>
  );
};

export default HomePage;
