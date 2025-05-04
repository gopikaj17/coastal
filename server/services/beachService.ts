import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, desc, asc } from "drizzle-orm";

/**
 * Fetch all beaches with their latest conditions and active hazards
 */
export async function getAllBeaches() {
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
    
    return beaches;
  } catch (error) {
    console.error("Error in getAllBeaches:", error);
    throw new Error("Failed to fetch beaches");
  }
}

/**
 * Fetch a specific beach with its details
 */
export async function getBeachById(beachId: number) {
  try {
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
      throw new Error("Beach not found");
    }
    
    return beach;
  } catch (error) {
    console.error(`Error in getBeachById for beachId=${beachId}:`, error);
    throw error;
  }
}

/**
 * Find beaches near a specific location
 */
export async function getNearbyBeaches(latitude: number, longitude: number, radius: number = 50) {
  try {
    // For a production app, this would use a spatial query with PostGIS
    // For this implementation, we'll get all beaches and calculate distances in JS
    
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
    }).filter(beach => beach.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    
    return nearbyBeaches;
  } catch (error) {
    console.error(`Error in getNearbyBeaches for lat=${latitude}, lon=${longitude}:`, error);
    throw new Error("Failed to find nearby beaches");
  }
}

/**
 * Get amenities for a specific beach
 */
export async function getBeachAmenities(beachId: number) {
  try {
    const amenities = await db.select().from(schema.amenities).where(
      eq(schema.amenities.beachId, beachId)
    ).orderBy(asc(schema.amenities.type));
    
    return amenities;
  } catch (error) {
    console.error(`Error in getBeachAmenities for beachId=${beachId}:`, error);
    throw new Error("Failed to fetch beach amenities");
  }
}

/**
 * Update beach condition data
 * In a real app, this would be called by a scheduled job that fetches from external APIs
 */
export async function updateBeachCondition(beachId: number, conditionData: Partial<schema.BeachConditionInsert>) {
  try {
    const [updatedCondition] = await db.insert(schema.beachConditions)
      .values({
        ...conditionData,
        beachId,
        updatedAt: new Date()
      })
      .returning();
    
    return updatedCondition;
  } catch (error) {
    console.error(`Error in updateBeachCondition for beachId=${beachId}:`, error);
    throw new Error("Failed to update beach condition");
  }
}
