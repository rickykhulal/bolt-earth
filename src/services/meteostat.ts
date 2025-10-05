/**
 * Meteostat API Integration via RapidAPI
 * 
 * Provides hourly weather data from Meteostat's global weather network
 */

import { supabase } from "@/integrations/supabase/client";

interface MeteostatData {
  available: boolean;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  pressure: number | null;
  precipitation: number | null;
  timestamp: string;
  source: string;
}

export const fetchMeteostatData = async (
  lat: number,
  lng: number
): Promise<MeteostatData | null> => {
  try {
    console.log(`Fetching Meteostat data for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('meteostat-weather', {
      body: { lat, lng }
    });

    if (error) {
      console.error("Meteostat edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("Meteostat unavailable:", data?.message || data?.error);
      return null;
    }

    console.log("Meteostat data retrieved successfully");
    return data as MeteostatData;
  } catch (error) {
    console.error("Error fetching Meteostat data:", error);
    return null;
  }
};
