import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, not, or } from "drizzle-orm";

/**
 * Fetch all active alerts
 */
export async function getAllAlerts(type?: string) {
  try {
    let query = db.select().from(schema.alerts).where(eq(schema.alerts.active, true));
    
    if (type && type !== 'all') {
      query = query.where(eq(schema.alerts.type, type));
    }
    
    const alerts = await query.orderBy(
      desc(schema.alerts.priority),
      desc(schema.alerts.createdAt)
    );
    
    return alerts;
  } catch (error) {
    console.error("Error in getAllAlerts:", error);
    throw new Error("Failed to fetch alerts");
  }
}

/**
 * Fetch alerts for a specific beach
 */
export async function getBeachAlerts(beachId: number) {
  try {
    const alerts = await db.select().from(schema.alerts).where(
      and(
        eq(schema.alerts.beachId, beachId),
        eq(schema.alerts.active, true)
      )
    ).orderBy(
      desc(schema.alerts.priority),
      desc(schema.alerts.createdAt)
    );
    
    return alerts;
  } catch (error) {
    console.error(`Error in getBeachAlerts for beachId=${beachId}:`, error);
    throw new Error("Failed to fetch beach alerts");
  }
}

/**
 * Create a new alert
 */
export async function createAlert(alertData: schema.AlertInsert) {
  try {
    const [newAlert] = await db.insert(schema.alerts)
      .values({
        ...alertData,
        active: true,
        createdAt: new Date()
      })
      .returning();
    
    return newAlert;
  } catch (error) {
    console.error("Error in createAlert:", error);
    throw new Error("Failed to create alert");
  }
}

/**
 * Update an existing alert
 */
export async function updateAlert(alertId: number, updateData: Partial<schema.AlertInsert>) {
  try {
    const [updatedAlert] = await db.update(schema.alerts)
      .set(updateData)
      .where(eq(schema.alerts.id, alertId))
      .returning();
    
    if (!updatedAlert) {
      throw new Error("Alert not found");
    }
    
    return updatedAlert;
  } catch (error) {
    console.error(`Error in updateAlert for alertId=${alertId}:`, error);
    throw error;
  }
}

/**
 * Deactivate an alert
 */
export async function deactivateAlert(alertId: number) {
  try {
    const [deactivatedAlert] = await db.update(schema.alerts)
      .set({ active: false })
      .where(eq(schema.alerts.id, alertId))
      .returning();
    
    if (!deactivatedAlert) {
      throw new Error("Alert not found");
    }
    
    return deactivatedAlert;
  } catch (error) {
    console.error(`Error in deactivateAlert for alertId=${alertId}:`, error);
    throw error;
  }
}

/**
 * Get emergency contacts
 */
export async function getEmergencyContacts() {
  try {
    const contacts = await db.select().from(schema.emergencyContacts);
    return contacts;
  } catch (error) {
    console.error("Error in getEmergencyContacts:", error);
    throw new Error("Failed to fetch emergency contacts");
  }
}

/**
 * Clean up expired alerts
 * This would typically be called by a scheduled job
 */
export async function cleanupExpiredAlerts() {
  try {
    const now = new Date();
    
    const deactivatedAlerts = await db.update(schema.alerts)
      .set({ active: false })
      .where(
        and(
          eq(schema.alerts.active, true),
          not(eq(schema.alerts.expiresAt, null)),
          or(
            eq(schema.alerts.expiresAt, null),
            or(schema.alerts.expiresAt as any < now)
          )
        )
      )
      .returning();
    
    return deactivatedAlerts;
  } catch (error) {
    console.error("Error in cleanupExpiredAlerts:", error);
    throw new Error("Failed to cleanup expired alerts");
  }
}
