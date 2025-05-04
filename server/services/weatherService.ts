import axios from "axios";

/**
 * Gets weather data from OpenWeatherMap API
 */
export async function getWeatherData(lat: number, lon: number) {
  try {
    // Use OpenWeatherMap API (free tier)
    const API_KEY = process.env.OPENWEATHER_API_KEY || "demo";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    
    // Fallback to mock data if API key not available or in demo mode
    if (API_KEY === "demo") {
      return {
        temperature: 30,
        feelsLike: 32,
        humidity: 75,
        windSpeed: 18,
        windDirection: "NE",
        conditions: "Clear",
        uvIndex: 8
      };
    }
    
    const response = await axios.get(url);
    return {
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(response.data.wind.deg),
      conditions: response.data.weather[0].main,
      uvIndex: 8 // Note: Basic OpenWeatherMap doesn't provide UV, this would need a separate API call
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}

/**
 * Gets marine data from APIs
 * In a real app, this would use specialized marine/ocean APIs
 */
export async function getMarineData(lat: number, lon: number) {
  try {
    // For demo, using static data
    // In production, integrate with marine data APIs:
    // - INCOIS Ocean State Forecast for Indian waters
    // - NOAA for international waters
    
    // This function would be replaced with actual API calls in a production app
    // but keeping the function here to maintain the interface
    
    const randomWaveHeight = (1 + Math.random() * 2).toFixed(1);
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const tideStatus = Math.random() > 0.5 ? "high" : "low";
    
    return {
      waveHeight: randomWaveHeight,
      waveDirection: randomDirection,
      waterTemp: 27 + Math.random() * 3,
      tideStatus: tideStatus,
      currentSpeed: (Math.random() * 5).toFixed(1)
    };
  } catch (error) {
    console.error("Error fetching marine data:", error);
    throw new Error("Failed to fetch marine data");
  }
}

/**
 * Helper function to convert wind degrees to direction
 */
export function getWindDirection(degrees: number) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Determine beach safety based on weather and marine conditions
 * This is a simplified model - a real system would use more complex criteria
 */
export function determineBeachSafety(
  waveHeight: number, 
  windSpeed: number, 
  waterQuality: string
) {
  // Evaluate individual safety factors (0-1 scale where 1 is safe)
  let waveSafety = 0;
  if (waveHeight < 1) waveSafety = 1;
  else if (waveHeight < 1.5) waveSafety = 0.8;
  else if (waveHeight < 2) waveSafety = 0.4;
  else waveSafety = 0;
  
  let windSafety = 0;
  if (windSpeed < 15) windSafety = 1;
  else if (windSpeed < 25) windSafety = 0.7;
  else if (windSpeed < 35) windSafety = 0.3;
  else windSafety = 0;
  
  let waterQualitySafety = 0;
  if (waterQuality === "good") waterQualitySafety = 1;
  else if (waterQuality === "moderate") waterQualitySafety = 0.5;
  else waterQualitySafety = 0;
  
  // Calculate overall safety score (weighted average)
  const overallSafety = (waveSafety * 0.4) + (windSafety * 0.3) + (waterQualitySafety * 0.3);
  
  // Determine safety status
  if (overallSafety >= 0.7) return "safe";
  else if (overallSafety >= 0.3) return "caution";
  else return "unsafe";
}
