import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const SelectVideo = () => {
  const { videos, addVideo, loadVideos } = useVideoStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadVideos();
    setTimeout(() => {
      setIsLoading(false);
    }
    , 1000);
  }, []);

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // ✅ Pick only videos
        allowsEditing: false,
        quality: 1,
      });
  
      console.log("ImagePicker result:", result); // ✅ Debugging
  
      if (!result.cancelled) {
        await addVideo({ uri: result.assets[0].uri, name: result.assets[0].fileName || "Selected Video" });
      }
    } catch (error) {
      console.error("Error picking video:", error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity className="p-4 bg-blue-500 rounded-lg mb-4" onPress={pickVideo}>
        <Text className="text-white text-lg text-center">Select Video</Text>
      </TouchableOpacity>

      <Text className="text-lg font-semibold">Saved Videos:</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
      ) : videos.length === 0 ? (
        <Text className="text-gray-500 mt-4">No videos available.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-3 bg-gray-200 my-2 rounded-lg"
              onPress={() => router.push(`/VideoDetail?uri=${encodeURIComponent(item.uri)}`)}
            >
              <Text className="text-black">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SelectVideo;
