import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Check if data already exists to avoid duplicates
    const existingBeaches = await db.select().from(schema.beaches);
    
    if (existingBeaches.length === 0) {
      // Seed beaches
      const beachesData = [
        {
          name: "Kovalam Beach",
          description: "A beautiful beach known for its clear waters and serene environment.",
          location: "Tamil Nadu, India",
          latitude: 12.7891,
          longitude: 80.2547,
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        },
        {
          name: "Marina Beach",
          description: "One of the longest urban beaches in the world with golden sands.",
          location: "Chennai, Tamil Nadu, India",
          latitude: 13.0500,
          longitude: 80.2824,
          imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206"
        },
        {
          name: "Mahabalipuram Beach",
          description: "Historic beach with ancient shore temples and rock carvings.",
          location: "Tamil Nadu, India",
          latitude: 12.6269,
          longitude: 80.1929,
          imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206"
        }
      ];
      
      console.log("Seeding beaches...");
      const insertedBeaches = await db.insert(schema.beaches).values(beachesData).returning();
      
      // Seed beach conditions
      const beachConditionsData = [
        {
          beachId: insertedBeaches[0].id, // Kovalam Beach
          safetyStatus: schema.SafetyStatus.SAFE,
          temperature: 32,
          feelsLike: 35,
          waveHeight: 1.2,
          waveDescription: "Moderate waves",
          windSpeed: 18,
          windDescription: "Mild breeze",
          uvIndex: 9,
          uvDescription: "Very High – Apply Sunscreen",
          waterQuality: "good",
          waterQualityDescription: "No major pollutants detected",
          tideStatus: "low",
          tideTime: "Low Tide at 11:15 AM – High Tide at 6:30 PM",
          tideDescription: "Low tide (receding)",
          swimmingAdvisory: "Safe for Swimming",
          advisoryDescription: "Caution for stronger waves after 3 PM"
        },
        {
          beachId: insertedBeaches[1].id, // Marina Beach
          safetyStatus: schema.SafetyStatus.CAUTION,
          temperature: 30,
          feelsLike: 32,
          waveHeight: 1.8,
          waveDescription: "Moderate to high waves",
          windSpeed: 25,
          windDescription: "Moderate winds",
          uvIndex: 8,
          uvDescription: "Very High – Apply Sunscreen",
          waterQuality: "moderate",
          waterQualityDescription: "Some turbidity observed",
          tideStatus: "high",
          tideTime: "High Tide at 2:30 PM – Low Tide at 8:45 PM",
          tideDescription: "High tide (approaching peak)",
          swimmingAdvisory: "Swim with Caution",
          advisoryDescription: "Strong winds may cause rough waters"
        },
        {
          beachId: insertedBeaches[2].id, // Mahabalipuram Beach
          safetyStatus: schema.SafetyStatus.UNSAFE,
          temperature: 29,
          feelsLike: 31,
          waveHeight: 2.5,
          waveDescription: "High waves, rough sea",
          windSpeed: 40,
          windDescription: "Strong winds",
          uvIndex: 7,
          uvDescription: "High – Use sunscreen",
          waterQuality: "poor",
          waterQualityDescription: "High turbidity and suspected pollution",
          tideStatus: "high",
          tideTime: "High Tide at 2:00 PM – Low Tide at 8:30 PM",
          tideDescription: "High tide with storm surge",
          swimmingAdvisory: "Unsafe for Swimming",
          advisoryDescription: "Dangerous conditions due to high waves and rip currents"
        }
      ];
      
      console.log("Seeding beach conditions...");
      await db.insert(schema.beachConditions).values(beachConditionsData);
      
      // Seed hazards
      const hazardsData = [
        {
          beachId: insertedBeaches[0].id, // Kovalam Beach
          type: "rip_current",
          severity: "moderate",
          description: "Moderate risk near rocky areas – Avoid deep waters",
          icon: "fas fa-exclamation-triangle",
          active: true
        },
        {
          beachId: insertedBeaches[0].id, // Kovalam Beach
          type: "heat",
          severity: "moderate",
          description: "UV levels are high – Stay hydrated and use sunscreen",
          icon: "fas fa-sun",
          active: true
        },
        {
          beachId: insertedBeaches[1].id, // Marina Beach
          type: "wind",
          severity: "moderate",
          description: "Strong winds expected – Secure loose items",
          icon: "fas fa-wind",
          active: true
        },
        {
          beachId: insertedBeaches[1].id, // Marina Beach
          type: "current",
          severity: "moderate",
          description: "Moderate currents present – Swim with caution",
          icon: "fas fa-water",
          active: true
        },
        {
          beachId: insertedBeaches[2].id, // Mahabalipuram Beach
          type: "tide",
          severity: "high",
          description: "High tide alert – Avoid shore areas between 2:00 PM and 5:00 PM",
          icon: "fas fa-exclamation-circle",
          active: true
        },
        {
          beachId: insertedBeaches[2].id, // Mahabalipuram Beach
          type: "rip_current",
          severity: "high",
          description: "Dangerous rip currents observed",
          icon: "fas fa-water",
          active: true
        },
        {
          beachId: insertedBeaches[2].id, // Mahabalipuram Beach
          type: "storm",
          severity: "high",
          description: "Storm warning in effect",
          icon: "fas fa-wind",
          active: true
        }
      ];
      
      console.log("Seeding hazards...");
      await db.insert(schema.hazards).values(hazardsData);
      
      // Seed amenities
      const amenitiesData = [
        // Kovalam Beach
        {
          beachId: insertedBeaches[0].id,
          type: "lifeguard",
          name: "Lifeguard Station",
          distance: 200,
          icon: "fas fa-life-ring"
        },
        {
          beachId: insertedBeaches[0].id,
          type: "restroom",
          name: "Public Restrooms",
          distance: 100,
          icon: "fas fa-restroom"
        },
        {
          beachId: insertedBeaches[0].id,
          type: "food",
          name: "Kovalam Seafood Restaurant",
          distance: 300,
          icon: "fas fa-utensils"
        },
        {
          beachId: insertedBeaches[0].id,
          type: "parking",
          name: "Beach Parking",
          distance: 150,
          icon: "fas fa-parking"
        },
        
        // Marina Beach
        {
          beachId: insertedBeaches[1].id,
          type: "lifeguard",
          name: "Marina Lifeguard Tower",
          distance: 300,
          icon: "fas fa-life-ring"
        },
        {
          beachId: insertedBeaches[1].id,
          type: "restroom",
          name: "Public Restrooms",
          distance: 200,
          icon: "fas fa-restroom"
        },
        {
          beachId: insertedBeaches[1].id,
          type: "food",
          name: "Beach Cafe",
          distance: 400,
          icon: "fas fa-utensils"
        },
        {
          beachId: insertedBeaches[1].id,
          type: "parking",
          name: "Marina Parking Lot",
          distance: 250,
          icon: "fas fa-parking"
        },
        
        // Mahabalipuram Beach
        {
          beachId: insertedBeaches[2].id,
          type: "lifeguard",
          name: "Beach Safety Point",
          distance: 350,
          icon: "fas fa-life-ring"
        },
        {
          beachId: insertedBeaches[2].id,
          type: "restroom",
          name: "Tourist Restrooms",
          distance: 250,
          icon: "fas fa-restroom"
        },
        {
          beachId: insertedBeaches[2].id,
          type: "food",
          name: "Shore Temple Restaurant",
          distance: 500,
          icon: "fas fa-utensils"
        },
        {
          beachId: insertedBeaches[2].id,
          type: "parking",
          name: "Temple Parking",
          distance: 300,
          icon: "fas fa-parking"
        }
      ];
      
      console.log("Seeding amenities...");
      await db.insert(schema.amenities).values(amenitiesData);
      
      // Seed alerts
      const alertsData = [
        {
          beachId: insertedBeaches[2].id, // Mahabalipuram Beach
          title: "High Tide Alert",
          description: "Dangerous high tide conditions expected at Mahabalipuram Beach. Avoid shore areas between 2:00 PM and 5:00 PM.",
          type: "ocean",
          priority: schema.AlertPriority.HIGH,
          icon: "fas fa-exclamation-triangle",
          active: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        },
        {
          beachId: insertedBeaches[1].id, // Marina Beach
          title: "Strong Wind Warning",
          description: "Wind speeds increasing to 25-30 km/h at Marina Beach. Use caution with beach umbrellas and light equipment.",
          type: "weather",
          priority: schema.AlertPriority.MEDIUM,
          icon: "fas fa-wind",
          active: true,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from now
        },
        {
          beachId: insertedBeaches[0].id, // Kovalam Beach
          title: "UV Index Update",
          description: "UV index is very high (9) at Kovalam Beach today. Remember to apply sunscreen and stay hydrated.",
          type: "weather",
          priority: schema.AlertPriority.LOW,
          icon: "fas fa-sun",
          active: true,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours from now
        }
      ];
      
      console.log("Seeding alerts...");
      await db.insert(schema.alerts).values(alertsData);
      
      // Seed emergency contacts
      const emergencyContactsData = [
        {
          name: "Coast Guard",
          number: "1800-180-3123",
          description: "National Coast Guard emergency hotline"
        },
        {
          name: "Beach Patrol",
          number: "104",
          description: "Local beach patrol emergency contact"
        }
      ];
      
      console.log("Seeding emergency contacts...");
      await db.insert(schema.emergencyContacts).values(emergencyContactsData);
      
      console.log("Seed data successfully inserted!");
    } else {
      console.log("Database already has data. Skipping seed operation.");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed();
