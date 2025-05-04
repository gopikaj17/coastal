import axios from "axios";
import { apiRequest } from "./queryClient";
import { 
  BeachWithCondition, 
  BeachWithDetails, 
  Coordinates, 
  WeatherData, 
  MarineData,
  AlertWithPriority,
  AlertFilterType,
  LocationResult
} from "@/types";
import { UserSettings } from "@shared/schema";

const API_BASE = "/api";

// Beach API calls
export const fetchBeaches = async (): Promise<BeachWithCondition[]> => {
  const res = await apiRequest("GET", `${API_BASE}/beaches`);
  return res.json();
};

export const fetchBeachDetails = async (id: number): Promise<BeachWithDetails> => {
  const res = await apiRequest("GET", `${API_BASE}/beaches/${id}`);
  return res.json();
};

export const fetchNearbyBeaches = async (
  coords: Coordinates, 
  radius: number = 300
): Promise<BeachWithCondition[]> => {
  const res = await apiRequest(
    "GET", 
    `${API_BASE}/beaches/near/${coords.latitude}/${coords.longitude}?radius=${radius}`
  );
  return res.json();
};

// Alerts API calls
export const fetchAlerts = async (
  type: AlertFilterType = "all"
): Promise<AlertWithPriority[]> => {
  const res = await apiRequest("GET", `${API_BASE}/alerts${type !== "all" ? `?type=${type}` : ""}`);
  return res.json();
};

export const fetchBeachAlerts = async (beachId: number): Promise<AlertWithPriority[]> => {
  const res = await apiRequest("GET", `${API_BASE}/beaches/${beachId}/alerts`);
  return res.json();
};

// Amenities API calls
export const fetchBeachAmenities = async (beachId: number) => {
  const res = await apiRequest("GET", `${API_BASE}/beaches/${beachId}/amenities`);
  return res.json();
};

// Emergency contacts API call
export const fetchEmergencyContacts = async () => {
  const res = await apiRequest("GET", `${API_BASE}/emergency-contacts`);
  return res.json();
};

// User settings API calls
export const fetchUserSettings = async (): Promise<UserSettings> => {
  const res = await apiRequest("GET", `${API_BASE}/settings`);
  return res.json();
};

export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const res = await apiRequest("PATCH", `${API_BASE}/settings`, settings);
  return res.json();
};

// External API calls for weather and marine data
export const fetchWeatherData = async (coords: Coordinates): Promise<WeatherData> => {
  const res = await apiRequest(
    "GET", 
    `${API_BASE}/weather/${coords.latitude}/${coords.longitude}`
  );
  return res.json();
};

export const fetchMarineData = async (coords: Coordinates): Promise<MarineData> => {
  const res = await apiRequest(
    "GET", 
    `${API_BASE}/marine/${coords.latitude}/${coords.longitude}`
  );
  return res.json();
};

// Get user's current location using browser's Geolocation API
export const getUserLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Get address from coordinates using reverse geocoding
export const getAddressFromCoords = async (coords: Coordinates): Promise<string> => {
  try {
    // Open-source Nominatim service (OpenStreetMap)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
      { headers: { "Accept-Language": "en" } }
    );
    
    if (response.data && response.data.display_name) {
      // Extract and format the address components for a cleaner display
      const address = response.data.address;
      if (address) {
        const city = address.city || address.town || address.village || address.hamlet;
        const state = address.state;
        
        if (city && state) {
          return `${city}, ${state}`;
        }
      }
      
      // Fallback to shorter version of display_name
      const displayParts = response.data.display_name.split(',');
      if (displayParts.length > 2) {
        return `${displayParts[0]}, ${displayParts[1]}`;
      }
      
      return response.data.display_name;
    }
    
    return "Unknown location";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown location";
  }
};

// Search for locations (cities, towns, etc.) by name
export const searchLocations = async (query: string): Promise<LocationResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const res = await apiRequest("GET", `${API_BASE}/search-location?q=${encodeURIComponent(query)}`);
    return res.json();
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

// Find beaches near a specific location by coordinates
export const searchBeachesNear = async (coords: Coordinates, radius: number = 300): Promise<BeachWithCondition[]> => {
  try {
    const res = await apiRequest(
      "GET", 
      `${API_BASE}/search-beaches-near?lat=${coords.latitude}&lon=${coords.longitude}&radius=${radius}`
    );
    return res.json();
  } catch (error) {
    console.error("Error finding beaches near location:", error);
    return [];
  }
};
