import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Button, ActivityIndicator, Dimensions } from "react-native";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

const SelectVideo = () => {
  const { addVideo, loadVideos } = useVideoStore();

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoSource, setVideoSource] = useState(null);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  useEffect(() => {
    loadVideos();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        const videoUri = result.assets[0].uri;
        setSelectedVideo(videoUri);
        setVideoSource(videoUri);
        await addVideo({ uri: videoUri, name: result.assets[0].fileName || "Selected Video" });
      }
    } catch (error) {
      console.error("Error picking video:", error);
    }
  };


  return (
    <View className="flex-1 p-4">
      <TouchableOpacity className="p-3 bg-violet-500 rounded-lg items-center mb-4" onPress={pickVideo}>
        <Text className="text-white text-lg font-bold">Select Video</Text>
      </TouchableOpacity>

      {selectedVideo && (
        <View className="items-center mb-5">
          <Text className="text-lg font-bold mb-2">Selected Video Preview:</Text>

          {isLoading ?(
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ):(
             <>
             <VideoView 
             style={{ width: width*0.95 , height: height*0.5 }}
             player={player} allowsFullscreen allowsPictureInPicture />
             <TouchableOpacity className="p-2"
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
             >
              {isPlaying ? "Pause" : "Play"}
             </TouchableOpacity>
             </>
          )}
         
        </View>
     )}
    </View>
  );
};

export default SelectVideo;
