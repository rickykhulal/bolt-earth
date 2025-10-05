/**
 * NASA IMERG API Integration via Lovable Cloud Edge Function
 * 
 * Uses NASA Earthdata authentication securely stored in environment variables.
 */

import { supabase } from "@/integrations/supabase/client";

interface ImergData {
  precipitation: number; // mm/hr
  timestamp: string;
}

export const fetchImergData = async (
  lat: number,
  lng: number
): Promise<ImergData | null> => {
  try {
    console.log(`Fetching IMERG data via edge function for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('nasa-imerg', {
      body: { lat, lng }
    });

    if (error) {
      console.error("NASA IMERG edge function error:", error);
      return null;
    }

    if (data?.error) {
      console.error("NASA IMERG API error:", data.error);
      return null;
    }

    console.log("NASA IMERG data retrieved successfully");
    return data as ImergData;
  } catch (error) {
    console.error("Error fetching NASA IMERG data:", error);
    return null;
  }
};
