import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import VideoCard from "@/components/home/VideoCard";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";

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

  const { videos, loadVideos } = useVideoStore();
  const router = useRouter();

  useEffect(() => {
    loadVideos();
  }, []);



  return (
    <View className="flex-1 mx-auto container bg-violet-50 ">
      <View className="flex-1 p-4 pb-24">
      <Text className="text-lg font-semibold text-violet-700">
        Previously Cropped Videos
        </Text>
        <View className="h-[1] w-full bg-violet-300 my-2 "/>
  
    {videos.length === 0 ? (
        <Text className="text-gray-500 mt-2">No videos available.</Text>
      ) : (
        <FlashList
          data={videos}
          estimatedItemSize={200}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-3 bg-white my-2 rounded-md"
              onPress={() => router.push(`/details/${item.name}`)}
            >
             <VideoCard styles="shadow-sm" item={item} />
            </TouchableOpacity>
          )}
        />)}
  
      </View>
    </View>
  );
};

export default HomePage;
