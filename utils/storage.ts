import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "video-storage";

export const getVideos = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveVideos = async (videos: any[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};
