/**
 * NASA TEMPO API Integration via Lovable Cloud Edge Function
 * 
 * Uses NASA Earthdata authentication securely stored in environment variables.
 */

import { supabase } from "@/integrations/supabase/client";

interface TempoData {
  no2: number | null;
  hcho: number | null;
  aerosolIndex: number | null;
  ozone: number | null;
  timestamp: string;
  available?: boolean;
  message?: string;
}

export const fetchTempoData = async (
  lat: number,
  lng: number
): Promise<TempoData | null> => {
  try {
    console.log(`Fetching TEMPO data via edge function for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('nasa-tempo', {
      body: { lat, lng }
    });

    if (error) {
      console.error("NASA TEMPO edge function error:", error);
      return null;
    }

    if (data?.error) {
      console.error("NASA TEMPO API error:", data.error);
      return null;
    }

    console.log("NASA TEMPO data retrieved successfully");
    return data as TempoData;
  } catch (error) {
    console.error("Error fetching NASA TEMPO data:", error);
    return null;
  }
};

/**
 * For production implementation:
 * 
 * 1. Enable Lovable Cloud
 * 2. Add NASA_EARTHDATA_TOKEN to Cloud secrets
 * 3. Create edge function:
 * 
 * ```typescript
 * import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
 * 
 * serve(async (req) => {
 *   const { lat, lng } = await req.json()
 *   const token = Deno.env.get('NASA_EARTHDATA_TOKEN')
 *   
 *   const response = await fetch(
 *     `https://tempo.earth.nasa.gov/api/v1/data?lat=${lat}&lon=${lng}`,
 *     { headers: { 'Authorization': `Bearer ${token}` } }
 *   )
 *   
 *   return new Response(JSON.stringify(await response.json()))
 * })
 * ```
 * 
 * 4. Call edge function from frontend instead of direct API call
 */
