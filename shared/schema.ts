import { pgTable, text, serial, integer, decimal, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Enums for safety status
export const SafetyStatus = {
  SAFE: 'safe',
  CAUTION: 'caution',
  UNSAFE: 'unsafe'
} as const;

export type SafetyStatus = typeof SafetyStatus[keyof typeof SafetyStatus];

// Enums for alert priority
export const AlertPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export type AlertPriority = typeof AlertPriority[keyof typeof AlertPriority];

// Beaches table
export const beaches = pgTable('beaches', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 6 }).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Beach conditions table
export const beachConditions = pgTable('beach_conditions', {
  id: serial('id').primaryKey(),
  beachId: integer('beach_id').references(() => beaches.id).notNull(),
  safetyStatus: text('safety_status').notNull(), // safe, caution, unsafe
  temperature: decimal('temperature', { precision: 5, scale: 2 }), // in Celsius
  feelsLike: decimal('feels_like', { precision: 5, scale: 2 }), // in Celsius 
  waveHeight: decimal('wave_height', { precision: 5, scale: 2 }), // in meters
  waveDescription: text('wave_description'),
  windSpeed: decimal('wind_speed', { precision: 5, scale: 2 }), // in km/h
  windDescription: text('wind_description'),
  uvIndex: integer('uv_index'),
  uvDescription: text('uv_description'),
  waterQuality: text('water_quality'), // good, moderate, poor
  waterQualityDescription: text('water_quality_description'),
  tideStatus: text('tide_status'), // high, low
  tideTime: text('tide_time'),
  tideDescription: text('tide_description'),
  swimmingAdvisory: text('swimming_advisory'),
  advisoryDescription: text('advisory_description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Hazards table
export const hazards = pgTable('hazards', {
  id: serial('id').primaryKey(),
  beachId: integer('beach_id').references(() => beaches.id).notNull(),
  type: text('type').notNull(), // rip_current, heat, jellyfish, etc.
  severity: text('severity').notNull(), // low, moderate, high
  description: text('description').notNull(),
  icon: text('icon'), // CSS class for icon
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Amenities table
export const amenities = pgTable('amenities', {
  id: serial('id').primaryKey(),
  beachId: integer('beach_id').references(() => beaches.id).notNull(),
  type: text('type').notNull(), // lifeguard, restroom, food, parking, etc.
  name: text('name').notNull(),
  distance: integer('distance'), // in meters
  icon: text('icon'), // CSS class for icon
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Alerts table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  beachId: integer('beach_id').references(() => beaches.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // weather, ocean, water_quality, safety
  priority: text('priority').notNull(), // high, medium, low
  icon: text('icon'), // CSS class for icon
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at')
});

// Emergency contacts table
export const emergencyContacts = pgTable('emergency_contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  number: text('number').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User settings table for preferences
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  darkMode: boolean('dark_mode').default(false),
  units: text('units').default('metric'), // metric, imperial
  language: text('language').default('english'),
  enablePushNotifications: boolean('enable_push_notifications').default(true),
  enableSafetyAlerts: boolean('enable_safety_alerts').default(true),
  enableWeatherUpdates: boolean('enable_weather_updates').default(true),
  enableWaterQualityAlerts: boolean('enable_water_quality_alerts').default(true),
  locationServices: boolean('location_services').default(true),
  dataRefreshRate: text('data_refresh_rate').default('15min'), // 15min, 30min, 60min, manual
  saveBeachHistory: boolean('save_beach_history').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const beachesRelations = relations(beaches, ({ many }) => ({
  conditions: many(beachConditions),
  hazards: many(hazards),
  amenities: many(amenities),
  alerts: many(alerts)
}));

export const beachConditionsRelations = relations(beachConditions, ({ one }) => ({
  beach: one(beaches, { fields: [beachConditions.beachId], references: [beaches.id] })
}));

export const hazardsRelations = relations(hazards, ({ one }) => ({
  beach: one(beaches, { fields: [hazards.beachId], references: [beaches.id] })
}));

export const amenitiesRelations = relations(amenities, ({ one }) => ({
  beach: one(beaches, { fields: [amenities.beachId], references: [beaches.id] })
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  beach: one(beaches, { fields: [alerts.beachId], references: [beaches.id] })
}));

// Schemas
export const beachesInsertSchema = createInsertSchema(beaches);
export const beachesSelectSchema = createSelectSchema(beaches);
export type Beach = z.infer<typeof beachesSelectSchema>;
export type BeachInsert = z.infer<typeof beachesInsertSchema>;

export const beachConditionsInsertSchema = createInsertSchema(beachConditions);
export const beachConditionsSelectSchema = createSelectSchema(beachConditions);
export type BeachCondition = z.infer<typeof beachConditionsSelectSchema>;
export type BeachConditionInsert = z.infer<typeof beachConditionsInsertSchema>;

export const hazardsInsertSchema = createInsertSchema(hazards);
export const hazardsSelectSchema = createSelectSchema(hazards);
export type Hazard = z.infer<typeof hazardsSelectSchema>;
export type HazardInsert = z.infer<typeof hazardsInsertSchema>;

export const amenitiesInsertSchema = createInsertSchema(amenities);
export const amenitiesSelectSchema = createSelectSchema(amenities);
export type Amenity = z.infer<typeof amenitiesSelectSchema>;
export type AmenityInsert = z.infer<typeof amenitiesInsertSchema>;

export const alertsInsertSchema = createInsertSchema(alerts);
export const alertsSelectSchema = createSelectSchema(alerts);
export type Alert = z.infer<typeof alertsSelectSchema>;
export type AlertInsert = z.infer<typeof alertsInsertSchema>;

export const emergencyContactsInsertSchema = createInsertSchema(emergencyContacts);
export const emergencyContactsSelectSchema = createSelectSchema(emergencyContacts);
export type EmergencyContact = z.infer<typeof emergencyContactsSelectSchema>;
export type EmergencyContactInsert = z.infer<typeof emergencyContactsInsertSchema>;

export const userSettingsInsertSchema = createInsertSchema(userSettings);
export const userSettingsSelectSchema = createSelectSchema(userSettings);
export type UserSettings = z.infer<typeof userSettingsSelectSchema>;
export type UserSettingsInsert = z.infer<typeof userSettingsInsertSchema>;
