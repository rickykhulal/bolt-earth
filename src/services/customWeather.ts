/**
 * Custom Weather API Integration
 * 
 * Provides weather data from user-provided custom API for cross-validation
 */

import { supabase } from "@/integrations/supabase/client";

interface CustomWeatherData {
  available: boolean;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  source: string;
}

export const fetchCustomWeatherData = async (
  lat: number,
  lng: number
): Promise<CustomWeatherData | null> => {
  try {
    console.log(`Fetching Custom Weather data for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('custom-weather', {
      body: { lat, lng }
    });

    if (error) {
      console.error("Custom Weather edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("Custom Weather unavailable:", data?.message || data?.error);
      return null;
    }

    console.log("Custom Weather data retrieved successfully");
    return data as CustomWeatherData;
  } catch (error) {
    console.error("Error fetching Custom Weather data:", error);
    return null;
  }
};
