import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  caption: string;
  createdAt: number; 
}

export const saveEntryToStorage = async (entry: TravelEntry) => {
  try {
    const stored = await AsyncStorage.getItem("travelEntries");
    const entries = stored ? JSON.parse(stored) : [];
    entries.push(entry);
    await AsyncStorage.setItem("travelEntries", JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving entry to storage", error);
    return false;
  }
};

export const getEntriesFromStorage = async (): Promise<TravelEntry[]> => {
  try {
    const stored = await AsyncStorage.getItem("travelEntries");
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading entries", error);
    return [];
  }
};

export const clearAllEntries = async () => {
  try {
    await AsyncStorage.removeItem("travelEntries");
    return true;
  } catch (error) {
    console.error("Error clearing entries", error);
    return false;
  }
};

export const deleteEntryFromStorage = async (id: string): Promise<boolean> => {
    try {
      const stored = await AsyncStorage.getItem("travelEntries");
      if (!stored) return false;
      
      const entries = JSON.parse(stored);
      const updatedEntries = entries.filter((entry: TravelEntry) => entry.id !== id);
      
      await AsyncStorage.setItem("travelEntries", JSON.stringify(updatedEntries));
      return true;
    } catch (error) {
      console.error("Error deleting entry", error);
      return false;
    }
  };