/**
 * NASA POWER API Integration via Lovable Cloud Edge Function
 * 
 * Provides weather data (temperature, humidity, precipitation, wind speed)
 * from NASA's Prediction Of Worldwide Energy Resources (POWER) project.
 */

import { supabase } from "@/integrations/supabase/client";

interface PowerData {
  temperature: number | null;
  humidity: number | null;
  precipitation: number | null;
  windSpeed: number | null;
  timestamp: string;
  available?: boolean;
  message?: string;
}

export const fetchPowerData = async (
  lat: number,
  lng: number
): Promise<PowerData | null> => {
  try {
    console.log(`Fetching NASA POWER data via edge function for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('nasa-power', {
      body: { lat, lng }
    });

    if (error) {
      console.error("NASA POWER edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("NASA POWER API unavailable:", data?.message || data?.error);
      return null;
    }

    console.log("NASA POWER data retrieved successfully");
    return data as PowerData;
  } catch (error) {
    console.error("Error fetching NASA POWER data:", error);
    return null;
  }
};
