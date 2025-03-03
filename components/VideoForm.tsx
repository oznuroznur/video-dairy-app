import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { VideoFormData } from '@/hooks/useVideoStore';

interface VideoFormProps {
  onSubmit: (data: VideoFormData) => void;
}

export const VideoForm: React.FC<VideoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<VideoFormData>({
    name: '',
    description: ''
  });

  return (
    <View className="w-full">
      <TextInput
        className="border p-2 rounded mb-4"
        placeholder="Video Name"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
      />
      <TextInput
        className="border p-2 rounded mb-4"
        placeholder="Description"
        multiline
        value={formData.description}
        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
      />
      <TouchableOpacity 
        className="bg-violet-500 p-3 rounded-lg"
        onPress={() => onSubmit(formData)}
      >
        <Text className="text-white text-center font-bold">Save Video</Text>
      </TouchableOpacity>
    </View>
  );
}; 