import React, { useCallback, useState } from "react";
import { View, FlatList, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getEntriesFromStorage, deleteEntryFromStorage } from "../utils/storage";
import EntryCard from "../components/EntryCard";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const stored = await getEntriesFromStorage();
      setEntries([...stored].reverse());
    } catch (error) {
      Alert.alert("Error", "Failed to load entries");
      console.error("Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const success = await deleteEntryFromStorage(id);
      if (success) {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      } else {
        Alert.alert("Error", "Failed to delete entry");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete entry");
      console.error("Error deleting entry:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  return (
    <View style={[styles.container, theme === "dark" && styles.dark]}>
     

      {/* Fixed Header with Theme Toggle */}
      <View style={[styles.headerContainer, theme === "dark" && styles.headerDark]}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
        <Text style={[styles.title, theme === "dark" && styles.textDark]}>
          Memories
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons 
            name={theme === "dark" ? "sunny" : "moon"} 
            size={24} 
            color={theme === "dark" ? "white" : "black"} 
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll of Cards with Captions */}
      <View style={styles.listContainer}>
        {entries.length === 0 ? (
          <Text style={[styles.noEntriesText, theme === "dark" && styles.textDark]}>
            No entries yet
          </Text>
        ) : (
          <FlatList
  showsVerticalScrollIndicator={false}
  data={entries}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.cardWithCaptionContainer}>
      <EntryCard entry={item} onDelete={handleDeleteEntry} />
      <View style={styles.captionContainer}>
        <Text style={[styles.captionText, theme === "dark" && styles.textDark]}>
          {item.caption}
        </Text>
      </View>
    </View>
  )}
  contentContainerStyle={styles.verticalListContent}
/>

        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#e9ecef',
    paddingBottom:60
  },
  dark: { 
    backgroundColor: "#121212"
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight ?? 50, // Add status bar height here
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#e9ecef',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerDark: {
    backgroundColor: '#121212',
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
    marginTop:20
  },
  themeToggle: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
  },
  verticalListContent: {
    paddingHorizontal: 26,
    paddingBottom: 20,
    paddingTop: 30,
  },
  
  cardWithCaptionContainer: {
    alignItems: 'center',
    width: "100%", // full width
    marginBottom: 24,
  },
  
  captionContainer: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    fontSize: 14,
    color: "#333",
    textAlign: 'center',
  },
  noEntriesText: {
    fontSize: 18,
    color: "#555",
    textAlign: 'center',
    marginTop: 100,
  },
  
  textDark: { 
    color: "white"
  },
});
