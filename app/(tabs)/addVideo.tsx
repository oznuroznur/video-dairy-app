import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";

const SelectVideo = () => {
  const { videos, addVideo, loadVideos } = useVideoStore();
  const router = useRouter(); // ✅ Use router instead of navigation

  useEffect(() => {
    loadVideos();
  }, []);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      });

      if (result.type === "success") {
        await addVideo({ uri: result.uri, name: result.name });
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

      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-3 bg-gray-200 my-2 rounded-lg"
            onPress={() => router.push({ pathname: "/VideoDetail", params: { uri: item.uri } })} // ✅ Fix navigation
          >
            <Text className="text-black">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SelectVideo;
