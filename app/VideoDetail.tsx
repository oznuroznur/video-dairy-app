import React from "react";
import { View } from "react-native";
import { Video } from "expo-av";
import { useLocalSearchParams } from "expo-router"; // ✅ Fix navigation

const VideoDetail = () => {
  const { uri } = useLocalSearchParams(); // ✅ Get params correctly

  return (
    <View className="flex-1 justify-center items-center">
      <Video
        source={{ uri }}
        useNativeControls
        className="w-80 h-40"
   
      />
    </View>
  );
};

export default VideoDetail;
