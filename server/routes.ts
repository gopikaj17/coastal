import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, not, or, asc } from "drizzle-orm";
import axios from "axios";

// Weather API service
async function getWeatherData(lat: number, lon: number) {
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
    return null;
  }
}

// Helper function to convert wind degrees to direction
function getWindDirection(degrees: number) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Marine conditions service (would use INCOIS or similar real API in production)
async function getMarineData(lat: number, lon: number) {
  try {
    // For demo, using static data
    // In production, integrate with marine data APIs:
    // - INCOIS Ocean State Forecast for Indian waters
    // - NOAA for international waters
    return {
      waveHeight: (Math.random() * 3).toFixed(1),
      waveDirection: "SE",
      waterTemp: 27 + Math.random() * 3,
      tideStatus: Math.random() > 0.5 ? "high" : "low",
      currentSpeed: (Math.random() * 5).toFixed(1)
    };
  } catch (error) {
    console.error("Error fetching marine data:", error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiPrefix = '/api';
  
  // Get all beaches with their latest conditions
  app.get(`${apiPrefix}/beaches`, async (req, res) => {
    try {
      const beaches = await db.query.beaches.findMany({
        with: {
          conditions: {
            orderBy: (conditions, { desc }) => [desc(conditions.updatedAt)],
            limit: 1
          },
          hazards: {
            where: (hazards, { eq }) => eq(hazards.active, true)
          }
        },
        orderBy: (beaches, { asc }) => [asc(beaches.name)]
      });
      
      res.json(beaches);
    } catch (error) {
      console.error("Error fetching beaches:", error);
      res.status(500).json({ message: "Error fetching beaches" });
    }
  });
  
  // Get a specific beach with full details
  app.get(`${apiPrefix}/beaches/:id`, async (req, res) => {
    try {
      const beachId = parseInt(req.params.id);
      
      if (isNaN(beachId)) {
        return res.status(400).json({ message: "Invalid beach ID" });
      }
      
      const beach = await db.query.beaches.findFirst({
        where: (beaches, { eq }) => eq(beaches.id, beachId),
        with: {
          conditions: {
            orderBy: (conditions, { desc }) => [desc(conditions.updatedAt)],
            limit: 1
          },
          hazards: {
            where: (hazards, { eq }) => eq(hazards.active, true)
          },
          amenities: true
        }
      });
      
      if (!beach) {
        return res.status(404).json({ message: "Beach not found" });
      }
      
      res.json(beach);
    } catch (error) {
      console.error("Error fetching beach details:", error);
      res.status(500).json({ message: "Error fetching beach details" });
    }
  });
  
  // Get beaches near a location
  app.get(`${apiPrefix}/beaches/near/:lat/:lon`, async (req, res) => {
    try {
      const latitude = parseFloat(req.params.lat);
      const longitude = parseFloat(req.params.lon);
      const radius = parseFloat(req.query.radius as string || "1000"); // Increased radius to 1000km to cover all Indian beaches
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }
      
      // For demo, we'll just get all beaches since we have a small dataset
      const beaches = await db.query.beaches.findMany({
        with: {
          conditions: {
            orderBy: (conditions, { desc }) => [desc(conditions.updatedAt)],
            limit: 1
          },
          hazards: {
            where: (hazards, { eq }) => eq(hazards.active, true)
          }
        }
      });
      
      // Calculate distance using Haversine formula
      const nearbyBeaches = beaches.map(beach => {
        const beachLat = parseFloat(beach.latitude.toString());
        const beachLon = parseFloat(beach.longitude.toString());
        
        // Simple distance calculation (Haversine formula)
        const R = 6371; // Earth radius in km
        const dLat = (beachLat - latitude) * Math.PI / 180;
        const dLon = (beachLon - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(beachLat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return {
          ...beach,
          distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
        };
      }).sort((a, b) => a.distance - b.distance);
      
      // Always return all beaches regardless of distance for the Indian subcontinent
      res.json(nearbyBeaches);
    } catch (error) {
      console.error("Error finding nearby beaches:", error);
      res.status(500).json({ message: "Error finding nearby beaches" });
    }
  });
  
  // Get all active alerts
  app.get(`${apiPrefix}/alerts`, async (req, res) => {
    try {
      // Filter alerts by type if provided
      const typeFilter = req.query.type as string | undefined;
      
      let query = db.select().from(schema.alerts).where(eq(schema.alerts.active, true));
      
      if (typeFilter && typeFilter !== 'all') {
        query = query.where(eq(schema.alerts.type, typeFilter));
      }
      
      const alerts = await query.orderBy(
        desc(schema.alerts.priority),
        desc(schema.alerts.createdAt)
      );
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Error fetching alerts" });
    }
  });
  
  // Get alerts for a specific beach
  app.get(`${apiPrefix}/beaches/:id/alerts`, async (req, res) => {
    try {
      const beachId = parseInt(req.params.id);
      
      if (isNaN(beachId)) {
        return res.status(400).json({ message: "Invalid beach ID" });
      }
      
      const alerts = await db.select().from(schema.alerts).where(
        and(
          eq(schema.alerts.beachId, beachId),
          eq(schema.alerts.active, true)
        )
      ).orderBy(
        desc(schema.alerts.priority),
        desc(schema.alerts.createdAt)
      );
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching beach alerts:", error);
      res.status(500).json({ message: "Error fetching beach alerts" });
    }
  });
  
  // Get amenities for a specific beach
  app.get(`${apiPrefix}/beaches/:id/amenities`, async (req, res) => {
    try {
      const beachId = parseInt(req.params.id);
      
      if (isNaN(beachId)) {
        return res.status(400).json({ message: "Invalid beach ID" });
      }
      
      const amenities = await db.select().from(schema.amenities).where(
        eq(schema.amenities.beachId, beachId)
      ).orderBy(asc(schema.amenities.type));
      
      res.json(amenities);
    } catch (error) {
      console.error("Error fetching beach amenities:", error);
      res.status(500).json({ message: "Error fetching beach amenities" });
    }
  });
  
  // Get emergency contacts
  app.get(`${apiPrefix}/emergency-contacts`, async (req, res) => {
    try {
      const contacts = await db.select().from(schema.emergencyContacts);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      res.status(500).json({ message: "Error fetching emergency contacts" });
    }
  });
  
  // Get or create user settings
  app.get(`${apiPrefix}/settings`, async (req, res) => {
    try {
      // For demo, we'll use a fixed user ID
      const userId = "default-user";
      
      let settings = await db.select().from(schema.userSettings).where(
        eq(schema.userSettings.userId, userId)
      );
      
      // If no settings found, create default settings
      if (settings.length === 0) {
        const defaultSettings = {
          userId,
          darkMode: false,
          units: "metric",
          language: "english",
          enablePushNotifications: true,
          enableSafetyAlerts: true,
          enableWeatherUpdates: true,
          enableWaterQualityAlerts: true,
          locationServices: true,
          dataRefreshRate: "15min",
          saveBeachHistory: true
        };
        
        const [newSettings] = await db.insert(schema.userSettings)
          .values(defaultSettings)
          .returning();
          
        return res.json(newSettings);
      }
      
      res.json(settings[0]);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Error fetching user settings" });
    }
  });
  
  // Update user settings
  app.patch(`${apiPrefix}/settings`, async (req, res) => {
    try {
      // For demo, we'll use a fixed user ID
      const userId = "default-user";
      const updates = req.body;
      
      // Validate the request body
      const { success } = schema.userSettingsInsertSchema.safeParse({
        ...updates,
        userId
      });
      
      if (!success) {
        return res.status(400).json({ message: "Invalid settings data" });
      }
      
      // Check if settings exist
      const existing = await db.select().from(schema.userSettings).where(
        eq(schema.userSettings.userId, userId)
      );
      
      if (existing.length === 0) {
        // Create new settings
        const [newSettings] = await db.insert(schema.userSettings)
          .values({
            ...updates,
            userId
          })
          .returning();
          
        return res.json(newSettings);
      }
      
      // Update existing settings
      const [updatedSettings] = await db.update(schema.userSettings)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(schema.userSettings.userId, userId))
        .returning();
        
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Error updating user settings" });
    }
  });
  
  // Get external weather data
  app.get(`${apiPrefix}/weather/:lat/:lon`, async (req, res) => {
    try {
      const latitude = parseFloat(req.params.lat);
      const longitude = parseFloat(req.params.lon);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }
      
      const weatherData = await getWeatherData(latitude, longitude);
      
      if (!weatherData) {
        return res.status(500).json({ message: "Error fetching weather data" });
      }
      
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Error fetching weather data" });
    }
  });
  
  // Get external marine data
  app.get(`${apiPrefix}/marine/:lat/:lon`, async (req, res) => {
    try {
      const latitude = parseFloat(req.params.lat);
      const longitude = parseFloat(req.params.lon);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }
      
      const marineData = await getMarineData(latitude, longitude);
      
      if (!marineData) {
        return res.status(500).json({ message: "Error fetching marine data" });
      }
      
      res.json(marineData);
    } catch (error) {
      console.error("Error fetching marine data:", error);
      res.status(500).json({ message: "Error fetching marine data" });
    }
  });

  // Search for location coordinates by query (city, state, etc.)
  app.get(`${apiPrefix}/search-location`, async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ message: "Search query too short" });
      }
      
      // Here we would normally use a geocoding API, but for demo we'll use a simple lookup
      // of major Indian cities
      const cities = [
        { name: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
        { name: "Mumbai", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777 },
        { name: "Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.2090 },
        { name: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
        { name: "Bangalore", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
        { name: "Hyderabad", state: "Telangana", latitude: 17.3850, longitude: 78.4867 },
        { name: "Kochi", state: "Kerala", latitude: 9.9312, longitude: 76.2673 },
        { name: "Goa", state: "Goa", latitude: 15.2993, longitude: 74.1240 },
        { name: "Pondicherry", state: "Puducherry", latitude: 11.9416, longitude: 79.8083 },
        { name: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185 },
        { name: "Madurai", state: "Tamil Nadu", latitude: 9.9252, longitude: 78.1198 },
        { name: "Thiruvananthapuram", state: "Kerala", latitude: 8.5241, longitude: 76.9366 },
        { name: "Mahabalipuram", state: "Tamil Nadu", latitude: 12.6269, longitude: 80.1929 },
        { name: "Puri", state: "Odisha", latitude: 19.8133, longitude: 85.8312 },
        { name: "Kovalam", state: "Kerala", latitude: 8.3988, longitude: 76.9820 }
      ];
      
      const queryLower = query.toLowerCase();
      const matches = cities.filter(city => 
        city.name.toLowerCase().includes(queryLower) || 
        city.state.toLowerCase().includes(queryLower)
      );
      
      if (matches.length === 0) {
        return res.status(404).json({ message: "No locations found matching your query" });
      }
      
      const results = matches.map(city => ({
        name: city.name,
        state: city.state,
        display: `${city.name}, ${city.state}`,
        latitude: city.latitude,
        longitude: city.longitude
      }));
      
      return res.json(results);
    } catch (error) {
      console.error("Error searching for location:", error);
      res.status(500).json({ message: "Error searching for location" });
    }
  });

  // Get beaches near a specific latitude and longitude with radius
  app.get(`${apiPrefix}/search-beaches-near`, async (req, res) => {
    try {
      const latitude = parseFloat(req.query.lat as string);
      const longitude = parseFloat(req.query.lon as string);
      const radius = parseFloat(req.query.radius as string || "300"); // Default 300km radius - increased from 30km
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }
      
      // Get all beaches first
      const beaches = await db.query.beaches.findMany({
        with: {
          conditions: {
            orderBy: (conditions, { desc }) => [desc(conditions.updatedAt)],
            limit: 1
          },
          hazards: {
            where: (hazards, { eq }) => eq(hazards.active, true)
          }
        }
      });
      
      // Calculate distance using Haversine formula
      const nearbyBeaches = beaches.map(beach => {
        const beachLat = parseFloat(beach.latitude.toString());
        const beachLon = parseFloat(beach.longitude.toString());
        
        // Simple distance calculation (Haversine formula)
        const R = 6371; // Earth radius in km
        const dLat = (beachLat - latitude) * Math.PI / 180;
        const dLon = (beachLon - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(beachLat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return {
          ...beach,
          distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
        };
      })
      .filter(beach => beach.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
      
      res.json(nearbyBeaches);
    } catch (error) {
      console.error("Error finding beaches near location:", error);
      res.status(500).json({ message: "Error finding beaches near location" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
