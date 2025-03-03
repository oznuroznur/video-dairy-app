import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoDetail = () => {
  const router = useRouter();
  const { index } = useLocalSearchParams(); // Get video index from navigation params
  const { videos } = useVideoStore();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (videos.length > 0 && index !== undefined) {
      setVideo(videos[parseInt(index, 10)]);
    }
  }, [videos, index]);

  const player = useVideoPlayer(video?.uri, (player) => {
    player.loop = false; // Don't loop by default
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  if (!video) {
    return (
      <View className="flex-1 p-5 items-center justify-center">
        <Text className="text-lg text-red-500 mb-5">Video not found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 items-center justify-center">
      <Text className="text-xl font-bold mb-3">{video.name}</Text>
      <Text className="text-base text-gray-600 mb-5 text-center">{video.description || "No description provided."}</Text>

      <VideoView
        className="w-[350px] h-[275px] rounded-lg"
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View className="mt-3 p-2">
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => (isPlaying ? player.pause() : player.play())}
        />
      </View>

      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
};

export default VideoDetail;