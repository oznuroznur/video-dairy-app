import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Video = {
  uri: string;
  name: string;
};

type VideoState = {
  videos: Video[];
  addVideo: (video: Video) => Promise<void>;
  loadVideos: () => Promise<void>;
};

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],

  addVideo: async (video) => {
    try {
      const storedVideos = await AsyncStorage.getItem("savedVideos");
      const videos = storedVideos ? JSON.parse(storedVideos) : [];
      const updatedVideos = [...videos, video];

      await AsyncStorage.setItem("savedVideos", JSON.stringify(updatedVideos));

      set({ videos: updatedVideos });
    } catch (error) {
      console.error("Error saving video:", error);
    }
  },

  loadVideos: async () => {
    try {
      console.log("Loading videos...");
      const storedVideos = await AsyncStorage.getItem("savedVideos");
      if (storedVideos) {
        set({ videos: JSON.parse(storedVideos) });
        console.log("Videos loaded:", storedVideos);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  },
}));
