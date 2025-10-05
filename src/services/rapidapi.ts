/**
 * RapidAPI Integration - Fallback for NASA data
 * 
 * Provides air quality and weather data as backup when NASA data is invalid or missing
 */

import { supabase } from "@/integrations/supabase/client";

interface RapidAPIAirQualityData {
  available: boolean;
  overall_aqi: number | null;
  CO: { concentration: number | null; aqi: number | null };
  NO2: { concentration: number | null; aqi: number | null };
  O3: { concentration: number | null; aqi: number | null };
  PM2: { concentration: number | null; aqi: number | null };
  PM10: { concentration: number | null; aqi: number | null };
  SO2: { concentration: number | null; aqi: number | null };
  source: string;
}

interface RapidAPIWeatherData {
  available: boolean;
  temperature: number | null;
  feels_like: number | null;
  humidity: number | null;
  wind_speed: number | null;
  wind_degrees: number | null;
  cloud_pct: number | null;
  min_temp: number | null;
  max_temp: number | null;
  source: string;
}

export const fetchRapidAPIAirQuality = async (
  city: string
): Promise<RapidAPIAirQualityData | null> => {
  try {
    console.log(`Fetching RapidAPI air quality data for city: ${city}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-airquality', {
      body: { city }
    });

    if (error) {
      console.error("RapidAPI air quality edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("RapidAPI air quality unavailable:", data?.message || data?.error);
      return null;
    }

    console.log("RapidAPI air quality data retrieved successfully");
    return data as RapidAPIAirQualityData;
  } catch (error) {
    console.error("Error fetching RapidAPI air quality data:", error);
    return null;
  }
};

export const fetchRapidAPIWeather = async (
  city: string
): Promise<RapidAPIWeatherData | null> => {
  try {
    console.log(`Fetching RapidAPI weather data for city: ${city}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-weather', {
      body: { city }
    });

    if (error) {
      console.error("RapidAPI weather edge function error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("RapidAPI weather unavailable:", data?.message || data?.error);
      return null;
    }

    console.log("RapidAPI weather data retrieved successfully");
    return data as RapidAPIWeatherData;
  } catch (error) {
    console.error("Error fetching RapidAPI weather data:", error);
    return null;
  }
};
