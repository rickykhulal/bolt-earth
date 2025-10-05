import { AirQualityData } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";

const OPENAQ_BASE_URL = "https://api.openaq.org/v2";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface OpenAQMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface OpenAQResponse {
  results: Array<{
    location: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    measurements: OpenAQMeasurement[];
  }>;
}

interface CachedData {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CachedData>();

const getCachedData = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const fetchOpenAQData = async (
  lat: number,
  lng: number,
  radius: number = 25000
): Promise<Partial<AirQualityData> | null> => {
  const cacheKey = `openaq_${lat}_${lng}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log("Using cached OpenAQ data");
    return cached;
  }

  try {
    console.log(`Fetching OpenAQ data via edge function for lat=${lat}, lng=${lng}`);
    
    const { data, error } = await supabase.functions.invoke('openaq-proxy', {
      body: { lat, lng, radius, limit: 10 }
    });

    if (error) {
      console.error("OpenAQ edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.error("OpenAQ API error:", data?.error);
      return null;
    }

    // OpenAQ v3 returns {results: [...]}
    if (!data?.results || data.results.length === 0) {
      console.warn("No OpenAQ data available for this location");
      return null;
    }

    // Find the nearest location with actual measurements
    let bestLocation = null;
    for (const location of data.results) {
      if (location.parameters && location.parameters.length > 0) {
        bestLocation = location;
        break;
      }
    }

    if (!bestLocation) {
      console.warn("No OpenAQ locations with measurements found");
      return null;
    }

    const measurements: Record<string, { value: number; unit: string }> = {};
    
    // OpenAQ v3 structure: location.parameters is an array of {name, lastValue, unit}
    bestLocation.parameters?.forEach((p: any) => {
      if (p.lastValue !== null && p.lastValue !== undefined) {
        measurements[p.name.toLowerCase()] = {
          value: p.lastValue,
          unit: p.unit || 'µg/m³'
        };
      }
    });

    // Calculate simplified AQI from available pollutants
    const pm25 = measurements.pm25?.value || measurements['pm2.5']?.value || 0;
    const no2 = measurements.no2?.value || 0;
    const ozone = measurements.o3?.value || measurements.ozone?.value || 0;
    const aqi = calculateAQI(pm25, no2, ozone);

    const result: Partial<AirQualityData> = {
      city: bestLocation.name || "Unknown",
      country: bestLocation.country?.name || "",
      lat: bestLocation.coordinates?.latitude || lat,
      lng: bestLocation.coordinates?.longitude || lng,
      aqi,
      pollutants: {
        pm25: measurements.pm25?.value || measurements['pm2.5']?.value || 0,
        pm10: measurements.pm10?.value || 0,
        no2: measurements.no2?.value || 0,
        ozone: measurements.o3?.value || measurements.ozone?.value || 0,
        so2: measurements.so2?.value || 0,
        co: measurements.co?.value || 0,
      },
      lastUpdated: new Date().toISOString(),
      dataSource: "OpenAQ (Ground Stations)",
    };

    setCachedData(cacheKey, result);
    console.log("OpenAQ data retrieved and cached successfully");
    return result;
  } catch (error) {
    console.error("Error in fetchOpenAQData:", error);
    return null;
  }
};

// Simplified AQI calculation (EPA standard for PM2.5, NO2, O3)
const calculateAQI = (pm25: number, no2: number, ozone: number): number => {
  const aqis: number[] = [];

  // PM2.5 AQI breakpoints (µg/m³)
  if (pm25 <= 12.0) aqis.push((pm25 / 12.0) * 50);
  else if (pm25 <= 35.4) aqis.push(50 + ((pm25 - 12.0) / (35.4 - 12.0)) * 50);
  else if (pm25 <= 55.4) aqis.push(100 + ((pm25 - 35.4) / (55.4 - 35.4)) * 50);
  else if (pm25 <= 150.4) aqis.push(150 + ((pm25 - 55.4) / (150.4 - 55.4)) * 50);
  else if (pm25 <= 250.4) aqis.push(200 + ((pm25 - 150.4) / (250.4 - 150.4)) * 100);
  else aqis.push(300 + ((pm25 - 250.4) / (500.4 - 250.4)) * 200);

  // NO2 AQI (ppb, convert from µg/m³: µg/m³ * 0.53)
  const no2ppb = no2 * 0.53;
  if (no2ppb <= 53) aqis.push((no2ppb / 53) * 50);
  else if (no2ppb <= 100) aqis.push(50 + ((no2ppb - 53) / (100 - 53)) * 50);
  else if (no2ppb <= 360) aqis.push(100 + ((no2ppb - 100) / (360 - 100)) * 50);
  else aqis.push(150 + ((no2ppb - 360) / (1249 - 360)) * 50);

  // Ozone AQI (ppb, convert from µg/m³: µg/m³ * 0.51)
  const o3ppb = ozone * 0.51;
  if (o3ppb <= 54) aqis.push((o3ppb / 54) * 50);
  else if (o3ppb <= 70) aqis.push(50 + ((o3ppb - 54) / (70 - 54)) * 50);
  else if (o3ppb <= 85) aqis.push(100 + ((o3ppb - 70) / (85 - 70)) * 50);
  else if (o3ppb <= 105) aqis.push(150 + ((o3ppb - 85) / (105 - 85)) * 50);
  else aqis.push(200);

  return Math.round(Math.max(...aqis));
};
