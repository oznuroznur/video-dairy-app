import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useVideoStore, VideoFormData } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { VideoForm } from "@/components/VideoForm";


const SelectVideo = () => {
  const { addVideo, clearAllVideos } = useVideoStore();
  const router = useRouter();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const player = useVideoPlayer(selectedVideo, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const videoUri = result.assets[0].uri;
        setSelectedVideo(videoUri);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error picking video:", error);
    }
  };

  const handleSaveVideo = async (formData: VideoFormData) => {
    setIsLoading(true);
    try {
      await addVideo({
        uri: selectedVideo,
        name: formData.name,
        description: formData.description,
        date: new Date().toISOString(),
      });
      router.push("/");
    } catch (error) {
      console.error("Error saving video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity 
        className="p-3 bg-red-500 rounded-lg items-center mb-4" 
        onPress={clearAllVideos}
      >
        <Text className="text-white text-lg font-bold">Clear All Videos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="p-3 bg-violet-500 rounded-lg items-center mb-4" 
        onPress={pickVideo}
      >
        <Text className="text-white text-lg font-bold">Select Video</Text>
      </TouchableOpacity>

      {selectedVideo && (
        <View className="items-center mb-5">
          <Text className="text-lg font-bold mb-2">Selected Video Preview:</Text>
          <VideoView 
            style={{ width: width*0.95, height: height*0.3 }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
          </TouchableOpacity>
        </View>
      )}

      {showForm && (
        <VideoForm onSubmit={handleSaveVideo} />
      )}

      {isLoading && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      )}
    </View>
  );
};

export default SelectVideo;
