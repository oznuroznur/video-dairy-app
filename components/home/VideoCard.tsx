import { useVideoContext } from "@/context/useVideContext";

import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const VideoCard = ({
  styles,
  item,
}: {
  styles: string;
  item: {
    url: string;
    name: string;
    video_id: string;
    date: string;
  };
}) => {
    const router = useRouter();
    const { setSelectedVideo } = useVideoContext();

  return (
    <TouchableOpacity
      className={`items-center pb-1 rounded-2xl bg-white ${styles}`}
      onPress={() => {
        setSelectedVideo(item);
        router.push(`/details/${item.video_id}`);
      }}
    >
      <TouchableOpacity className="w-full" onPress={() => router.push(`/details/${item.video_id}`)}>
        <Image
          source={typeof item.url === "string" ? { uri: item.url } : item.url}
          className="w-full h-44 rounded-2xl"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View className="flex flex-col w-full p-2 space-y-2">
        <Text className="font-medium text-base ">{item.name}</Text>
        <View className="flex-row  items-center justify-between pr-2">
          <View className="justify-center items-center flex-row">
            <Text className=" text-main-color text-xs">{item.date}</Text>
          </View>
          <View className="flex flex-row gap-x-1 items-center">
            <Text className="text-xs">Detayı Gör</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VideoCard;
