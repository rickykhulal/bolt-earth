/**
 * NASA Daymet API Integration via Lovable Cloud Edge Function
 * 
 * Provides daily temperature and precipitation data for air quality analysis.
 */

import { supabase } from "@/integrations/supabase/client";

interface DaymetData {
  tmax: number; // °C
  tmin: number; // °C
  prcp: number; // mm
  timestamp: string;
}

export const fetchDaymetData = async (
  lat: number,
  lng: number
): Promise<DaymetData | null> => {
  try {
    console.log(`Fetching Daymet data via edge function for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('nasa-daymet', {
      body: { lat, lng }
    });

    if (error) {
      console.error("NASA Daymet edge function error:", error);
      return null;
    }

    if (data?.error) {
      console.error("NASA Daymet API error:", data.error);
      return null;
    }

    console.log("NASA Daymet data retrieved successfully");
    return data as DaymetData;
  } catch (error) {
    console.error("Error fetching Daymet data:", error);
    return null;
  }
};
