import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "lucide-react-native";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoContext } from "@/context/useVideContext";
import { DATA } from "../(tabs)";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const VideoDetail = () => {
  const router = useRouter();
  const { video_id } = useLocalSearchParams();
  const { selectedVideo } = useVideoContext();

  const video = selectedVideo || DATA.find((v) => v.video_id === video_id);

  if (!video) {
    return (
      <View className="p-4 items-center">
        <Text className="text-lg">Video not found.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-2 p-2 bg-violet-500 rounded-lg w-40"
        >
          <Text className="text-white text-center">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerImage={
        <View className="w-full h-full  ">
          <BackButton styles="absolute top-16 left-0 z-50" onPress={() => router.back()} />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-30" />
          <Image
            className="flex-1 w-full h-full "
            source={typeof video.url === "string" ? { uri: video.url } : video.url}
            resizeMode="cover"
          />
        </View>
      }
      headerBackgroundColor={{ light: "#ffffff", dark: "#000000" }}
    >
      <View className="flex-1 min-h-screen rounded-t-[35px] pt-6 sticky top-0">
        <View className="flex flex-row justify-between">
          <Text className="text-xl font-medium w-[60%] pl-5">{video.name}</Text>
        </View>

        <View className="flex flex-row justify-around border border-light-border py-3 mt-5">
          <View className="flex flex-col items-center">
            <Camera fill="#F34900" width={24} height={24} />
            <Text className="text-sm font-semibold text-center lowercase"> dk </Text>
          </View>
          <View className="flex flex-col items-center">
            <Camera />
            <Text className="text-sm font-semibold text-center"> min </Text>
          </View>
        </View>

        <View className="my-12 px-5">
          <Text className="text-main-color font-semibold text-base">Nasıl Yapılır?</Text>
          <Text className="text-sm text-black font-normal mt-2">asd</Text>
        </View>

        <View className="mb-8 mx-4">
          <Text className="text-main-color font-semibold text-base">Malzemeler</Text>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default VideoDetail;
