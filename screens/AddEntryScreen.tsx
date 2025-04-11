import { useEffect, useState } from "react";
import { View, Button, Image, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { randomUUID } from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  useEffect(() => {
    const getPermissions = async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await Notifications.requestPermissionsAsync();
    };
    getPermissions();
  }, []);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await getLocation();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
      console.error("Error taking picture:", error);
    }
  };

  const getLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      const first = geocode[0];
      const addr = `${first.name || ''}, ${first.city || ''}, ${first.region || ''}`.replace(/^,\s*|\s*,\s*$/g, '');
      setAddress(addr);
    } catch (error) {
      Alert.alert("Error", "Failed to get location");
      console.error("Error getting location:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const saveEntry = async () => {
    if (isSaving) return;
    
    if (!imageUri) {
      Alert.alert("Error", "Please take a picture first");
      return;
    }
  
    if (!address) {
      Alert.alert("Error", "Waiting for location...");
      return;
    }
  
    setIsSaving(true);
    try {
      const newEntry = {
        id: randomUUID(),
        imageUri,
        address,
        createdAt: Date.now(),
      };
  
      const stored = await AsyncStorage.getItem("travelEntries");
      const entries = stored ? JSON.parse(stored) : [];
      const updated = [...entries, newEntry];
      
      await AsyncStorage.setItem("travelEntries", JSON.stringify(updated));

      // Schedule a local push notification
      await Notifications.presentNotificationAsync({
        title: "New Memory Added 🗺️",
        body: "Your travel moment has been saved to your memories.",
      });

      // Reset the state and navigate back to the Home screen
      setImageUri(null);
      setAddress(null);
      navigation.goBack('Home');
    } catch (error) {
      Alert.alert("Error", "Failed to save entry");
      console.error("Error saving entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setImageUri(null);
      setAddress(null);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[{ flex: 1 }, theme === "dark" ? { backgroundColor: "#121212" } : { backgroundColor: "#fff" }]}>
      <View style={[styles.header, theme === "dark" && styles.headerDark]}>
        <Text style={[styles.headerText, theme === "dark" && styles.textDark]}>
          Add Entry
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={theme === "dark" ? { backgroundColor: "#121212" } : { backgroundColor: "#e9ecef" }}
        contentContainerStyle={[styles.container, { paddingBottom: 90, paddingTop: 5 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={takePicture} disabled={isSaving}>
            <View style={styles.iconWrapper}>
              <Ionicons name="camera" size={50} color={theme === "dark" ? "#83c5be" : "#83c5be"} />
            </View>
            <Text style={[styles.iconText, theme === "dark" && styles.textDark]}>
              {imageUri ? "Retake Photo" : "Take a Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoadingLocation && (
          <Text style={[styles.statusText, theme === "dark" && styles.textDark]}>
            Getting location...
          </Text>
        )}
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}

{address && (
  <View style={styles.addressContainer}>
    <Ionicons 
      name="location" 
      size={20} 
      color={theme === "dark" ? "#83c5be" : "#006d77"} 
      style={styles.locationIcon}
    />
    <Text style={[styles.address, theme === "dark" && styles.textDark]}>
      {address}
    </Text>
  </View>
)}
      </ScrollView>

      <TouchableOpacity
        onPress={saveEntry}
        disabled={isSaving || !imageUri || !address}
        style={[styles.floatingButton, (isSaving || !imageUri || !address) ? styles.buttonDisabled : styles.buttonEnabled]}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save Entry"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dark: {
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 70,
    paddingBottom: 15,
    backgroundColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    zIndex: 1,
  },
  headerDark: {
    backgroundColor: "#121212",
    borderBottomWidth: 0.3,
    borderColor: "#333",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  
  iconContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  iconWrapper: {
    backgroundColor: "#f5f5f5",
    borderRadius: 70,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  textDark: {
    color: "white",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 110,
  },
  locationIcon: {
    marginRight: 8,
  },
  address: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007BFF",
  },
  floatingButton: {
    position: "absolute",
    bottom: 120,
    left: "10%",
    right: "10%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    
    
  },
  saveButtonText:{
    fontSize:15,
    fontWeight: '600',
    alignContent:'center',
    padding:3,
    color:'#fff'

  },
  
  buttonEnabled: {
    backgroundColor: "#0a9396",
  },
  
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  
});
