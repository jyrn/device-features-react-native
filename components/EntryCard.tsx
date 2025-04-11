import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { TravelEntry } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";  // Importing Ionicons for the heart icon

interface EntryCardProps {
  entry: TravelEntry;
  onDelete: (id: string) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  const [isFavorite, setIsFavorite] = useState(false);  // State to toggle the heart icon

  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(entry.id), style: "destructive" },
      ]
    );
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(prev => !prev);  // Toggle the favorite state
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />

      {/* Overlays: caption (top-left), address (bottom-left) */}
      <View style={styles.overlay}>
        {entry.caption && (
          <Text style={styles.caption} numberOfLines={1}>
            {entry.caption}
          </Text>
        )}
        <Text style={styles.location} numberOfLines={2}>
          {entry.address}
        </Text>
      </View>

      {/* Buttons container for delete and favorite */}
      <View style={styles.buttonContainer}>
        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>

        {/* Heart Toggle Button */}
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9 * 1.1,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  caption: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  location: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily:"Kreftin Demo",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",  // Align the buttons side by side
    justifyContent: "flex-end",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 191, 191, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,  // Space between the delete button and heart
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 28,
    marginTop: -2,
  },
  favoriteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",  // Slight transparent background to make the heart visible
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EntryCard;
