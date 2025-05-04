import { Beach, BeachCondition, Hazard, Amenity, Alert, EmergencyContact, UserSettings } from "@shared/schema";

// Beach with its related condition data
export interface BeachWithCondition extends Beach {
  conditions: BeachCondition[];
  hazards: Hazard[];
  distance?: number;
}

// Beach with full details including amenities
export interface BeachWithDetails extends BeachWithCondition {
  amenities: Amenity[];
}

// Coordinates type
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// User's location info
export interface LocationInfo {
  coordinates: Coordinates;
  address: string;
  lastUpdated: Date;
}

// External weather data from API
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
  uvIndex: number;
}

// External marine data from API
export interface MarineData {
  waveHeight: string;
  waveDirection: string;
  waterTemp: number;
  tideStatus: string;
  currentSpeed: string;
}

// Alert with priority type guard
export interface AlertWithPriority extends Alert {
  priority: "high" | "medium" | "low";
}

// Filter types
export type AlertFilterType = "all" | "weather" | "ocean" | "water_quality" | "safety";

// App context state
export interface AppState {
  userLocation: LocationInfo | null;
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
}

// Theme settings
export type ThemeMode = "light" | "dark";

// Measurement units
export type Units = "metric" | "imperial";

// Data refresh rate
export type RefreshRate = "15min" | "30min" | "60min" | "manual";

// App Language
export type Language = "english" | "hindi" | "tamil" | "telugu";

// Location search result 
export interface LocationResult {
  name: string;
  state: string;
  display: string;
  latitude: number;
  longitude: number;
}
