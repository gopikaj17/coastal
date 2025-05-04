import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format distance for display
export function formatDistance(distance: number | undefined): string {
  if (distance === undefined) return "Unknown distance";
  
  if (distance < 1) {
    // Convert to meters for distances less than 1km
    return `${Math.round(distance * 1000)}m away`;
  }
  
  return `${distance} km away`;
}

// Calculate time since update
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const updateTime = new Date(date);
  const seconds = Math.floor((now.getTime() - updateTime.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// Format timestamp to human-readable time
export function formatTime(time: string): string {
  try {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return time; // If it's already a formatted string like "11:15 AM"
  }
}

// Get safety status color class
export function getSafetyStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'safe':
      return 'text-[#22C55E]';
    case 'caution':
      return 'text-[#F59E0B]';
    case 'unsafe':
      return 'text-[#EF4444]';
    default:
      return 'text-neutral-500';
  }
}

// Get alert priority color class
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-[#EF4444] bg-[#EF4444]/10';
    case 'medium':
      return 'text-[#F59E0B] bg-[#F59E0B]/10';
    case 'low':
      return 'text-neutral-700 bg-neutral-100';
    default:
      return 'text-neutral-500 bg-neutral-100';
  }
}

// Get water quality color
export function getWaterQualityColor(quality: string): string {
  switch (quality.toLowerCase()) {
    case 'good':
      return 'text-[#22C55E]';
    case 'moderate':
      return 'text-[#F59E0B]';
    case 'poor':
      return 'text-[#EF4444]';
    default:
      return 'text-neutral-500';
  }
}

// Calculate UV index description and color
export function getUVInfo(uvIndex: number): { description: string; color: string } {
  if (uvIndex <= 2) {
    return { description: 'Low', color: 'text-green-500' };
  } else if (uvIndex <= 5) {
    return { description: 'Moderate', color: 'text-yellow-500' };
  } else if (uvIndex <= 7) {
    return { description: 'High', color: 'text-orange-500' };
  } else if (uvIndex <= 10) {
    return { description: 'Very High', color: 'text-red-500' };
  } else {
    return { description: 'Extreme', color: 'text-purple-500' };
  }
}

// Calculate wave height safety level
export function getWaveHeightInfo(waveHeight: number): { safe: boolean; description: string } {
  if (waveHeight < 1) {
    return { safe: true, description: 'Calm waters' };
  } else if (waveHeight < 1.5) {
    return { safe: true, description: 'Safe for swimming' };
  } else if (waveHeight < 2) {
    return { safe: false, description: 'Moderate waves, swim with caution' };
  } else {
    return { safe: false, description: 'High waves, dangerous for swimming' };
  }
}

// Calculate wind speed description
export function getWindDescription(windSpeed: number): string {
  if (windSpeed < 10) {
    return 'Light breeze';
  } else if (windSpeed < 20) {
    return 'Mild breeze';
  } else if (windSpeed < 30) {
    return 'Moderate winds';
  } else if (windSpeed < 40) {
    return 'Strong winds';
  } else {
    return 'Very strong winds';
  }
}

// Convert temperature based on units setting
export function convertTemperature(temp: number, unit: 'metric' | 'imperial'): { value: number; symbol: string } {
  if (unit === 'imperial') {
    return { value: Math.round((temp * 9 / 5) + 32), symbol: '°F' };
  }
  return { value: Math.round(temp), symbol: '°C' };
}

// Convert wind speed based on units setting
export function convertWindSpeed(speed: number, unit: 'metric' | 'imperial'): { value: number; symbol: string } {
  if (unit === 'imperial') {
    return { value: Math.round(speed / 1.609), symbol: 'mph' };
  }
  return { value: Math.round(speed), symbol: 'km/h' };
}

// Convert distance based on units setting
export function convertDistance(distance: number, unit: 'metric' | 'imperial'): { value: number; symbol: string } {
  if (unit === 'imperial') {
    if (distance < 0.5) {
      // Convert to feet for small distances
      return { value: Math.round(distance * 5280), symbol: 'ft' };
    }
    return { value: Math.round(distance / 1.609 * 10) / 10, symbol: 'mi' };
  }
  
  if (distance < 1) {
    // Convert to meters for small distances
    return { value: Math.round(distance * 1000), symbol: 'm' };
  }
  return { value: Math.round(distance * 10) / 10, symbol: 'km' };
}
