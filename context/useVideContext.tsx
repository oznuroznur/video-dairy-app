import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Video {
  url: string;
  name: string;
  video_id: string;
  date: string;
}

interface VideoContextType {
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedVideo, setSelectedVideoState] = useState<Video | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      const storedVideo = await AsyncStorage.getItem("selectedVideo");
      if (storedVideo) {
        setSelectedVideoState(JSON.parse(storedVideo));
      }
    };
    loadVideo();
  }, []);

  const setSelectedVideo = async (video: Video) => {
    setSelectedVideoState(video);
    await AsyncStorage.setItem("selectedVideo", JSON.stringify(video));
  };

  return (
    <VideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
