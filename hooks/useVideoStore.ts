import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

type Video = {
  uri: string;
  name: string;
  date?: string;
  description?: string;
};

type VideoState = {
  videos: Video[];
  selectedVideo: Video | null;
  addVideo: (video: Video) => Promise<void>;
  loadVideos: () => Promise<void>;
  setSelectedVideo: (video: Video) => void;
  clearAllVideos: () => Promise<void>;
};

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  selectedVideo: null,

  addVideo: async (video) => {
    try {
      const storedVideos = await AsyncStorage.getItem("savedVideos");
      const videos = storedVideos ? JSON.parse(storedVideos) : [];
      const updatedVideos = [...videos, video];
      await AsyncStorage.setItem("savedVideos", JSON.stringify(updatedVideos));
      console.log("Video saved:", video);
      set({ videos: updatedVideos });
    } catch (error) {
      console.error("Error saving video:", error);
    }
  },

  loadVideos: async () => {
    try {
      const storedVideos = await AsyncStorage.getItem("savedVideos");
      if (storedVideos) {
        const parsedVideos = JSON.parse(storedVideos);
        console.log("Loaded videos:", parsedVideos);
        set({ videos: parsedVideos });
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  },

  setSelectedVideo: (video) => {
    console.log("Setting selected video:", video);
    set({ selectedVideo: video });
  },

  clearAllVideos: async () => {
    try {
      await AsyncStorage.setItem("savedVideos", JSON.stringify([]));
      set({ videos: [] });
      console.log("All videos cleared");
    } catch (error) {
      console.error("Error clearing videos:", error);
    }
  },
}));

export const videoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type VideoFormData = z.infer<typeof videoFormSchema>;
