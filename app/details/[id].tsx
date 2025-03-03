import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Slider from "@react-native-community/slider";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';

const VideoDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const selectedVideo = useVideoStore((state) => state.selectedVideo);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(5); // Default 5-second segment
  const [metadata, setMetadata] = useState({ name: '', description: '' });
  const [step, setStep] = useState(1); // 1: Trim, 2: Metadata, 3: Processing

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const player = useVideoPlayer(selectedVideo?.uri, (player) => {
    player.loop = true;
    player.play();
    setVideoDuration(player.duration);
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  // Tanstack Query mutation for video processing
  const cropMutation = useMutation({
    mutationFn: async ({ start, end, name, description }) => {
      // Here you would implement the FFMPEG processing
      // Example API call:
      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: JSON.stringify({
          videoUri: selectedVideo?.uri,
          startTime: start,
          endTime: end,
          metadata: { name, description }
        })
      });
      return response.json();
    },
    onSuccess: () => {
      router.push("/");
    }
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      cropMutation.mutate({
        start: trimStart,
        end: trimEnd,
        name: metadata.name,
        description: metadata.description
      });
    }
  };

  if (!selectedVideo) {
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
    <View className="flex-1">
      <View className="items-center mb-5">
        <VideoView 
          style={{ width: width*0.95, height: height*0.4 }}
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
          <Text>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        {step === 1 ? (
          // Step 1: Trim Selection
          <View>
            <Text className="text-lg font-bold mb-4">Select 5-Second Segment</Text>
            <Slider
              style={{width: width*0.95, height: 40}}
              minimumValue={0}
              maximumValue={Math.max(0, videoDuration - 5)}
              value={trimStart}
              onValueChange={(value) => {
                setTrimStart(value);
                setTrimEnd(value + 5);
                if (player?.seek) {
                  player.seek(value);
                }
              }}
              minimumTrackTintColor="#8b5cf6"
              maximumTrackTintColor="#000000"
            />
            
            <View className="flex-row justify-between mb-4">
              <Text>Start: {Math.floor(trimStart)}s</Text>
              <Text>End: {Math.floor(trimEnd)}s</Text>
            </View>
          </View>
        ) : (
          // Step 2: Metadata
          <View>
            <Text className="text-lg font-bold mb-4">Add Video Details</Text>
            <TextInput
              className="border p-2 rounded mb-4"
              placeholder="Video Name"
              value={metadata.name}
              onChangeText={(text) => setMetadata(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              className="border p-2 rounded mb-4 h-24"
              placeholder="Description"
              multiline
              value={metadata.description}
              onChangeText={(text) => setMetadata(prev => ({ ...prev, description: text }))}
            />
          </View>
        )}

        <TouchableOpacity
          className="mt-4 p-3 bg-violet-500 rounded-lg"
          onPress={handleNext}
          disabled={cropMutation.isPending}
        >
          <Text className="text-white text-center font-bold">
            {step === 1 ? "Next" : cropMutation.isPending ? "Processing..." : "Crop Video"}
          </Text>
        </TouchableOpacity>
      </View>

      {cropMutation.isPending && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <Text className="text-white mb-4">Processing video...</Text>
        </View>
      )}
    </View>
  );
};

export default VideoDetail;
