import { ChevronLeft } from "lucide-react-native"
import React from "react"
import { TouchableOpacity, View } from "react-native"


export default function BackButton({ onPress , styles} : { onPress: () => void, styles: string }) {
	return (
			<TouchableOpacity 
				onPress={onPress}
				className={`${styles} w-16 h-8 items-center `}
			>
				<ChevronLeft />
			</TouchableOpacity>
	)
}
