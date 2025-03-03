import { Image, Text, TouchableOpacity, View } from "react-native";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { ActivityIndicator } from "react-native";

const VideoCard = ({
  styles,
  item,
}: {
  styles: string;
  item: {
    uri: string;
    name: string;
    date?: string;
    description?: string;
  };
}) => {
  const router = useRouter();
  const setSelectedVideo = useVideoStore((state) => state.setSelectedVideo);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateThumbnail();
  }, [item.uri]);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(item.uri, {
        time: 0,
        quality: 0.5,
      });
      setThumbnail(uri);
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className={`items-center pb-1 rounded-2xl bg-white ${styles}`}
      onPress={() => {
        setSelectedVideo(item);
        router.push(`/details/${item.name}`);
      }}
    >
      <View className="w-full">
        {isLoading ? (
          <View className="w-full h-44 rounded-t-2xl bg-gray-200 items-center justify-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-44 rounded-t-2xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-44 rounded-t-2xl bg-gray-200 items-center justify-center">
            <Text className="text-gray-500">No thumbnail</Text>
          </View>
        )}
      </View>

      <View className="flex flex-col w-full p-2 space-y-2">
        <Text className="font-medium text-base">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View className="flex-row items-center justify-between pr-2">
          <Text className="text-xs text-gray-500">{item.date || "No date"}</Text>
          <Text className="text-xs text-violet-600">View Details</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VideoCard;
