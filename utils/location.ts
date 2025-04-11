import * as Location from "expo-location";

export const getCurrentAddress = async (): Promise<string | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permission denied.");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync(location.coords);
    const place = geocode[0];
    const formatted = `${place.name ?? ""}, ${place.city ?? ""}, ${place.region ?? ""}`;
    return formatted.trim();
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};
