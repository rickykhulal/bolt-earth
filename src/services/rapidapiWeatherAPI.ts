/**
 * WeatherAPI.com Integration via RapidAPI
 * 
 * Provides comprehensive weather data with AccuWeather-level accuracy
 */

import { supabase } from "@/integrations/supabase/client";

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  pressure: number;
  visibility: number;
  cloud_cover: number;
  uv_index: number;
  condition: string;
  condition_icon: string;
  is_day: number;
  location: WeatherLocation;
}

interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  precipitation_chance: number;
}

interface DailyForecast {
  date: string;
  max_temp: number;
  min_temp: number;
  avg_temp: number;
  condition: string;
  condition_icon: string;
  precipitation_chance: number;
  humidity: number;
  uv_index: number;
  sunrise: string;
  sunset: string;
  hourly?: HourlyForecast[];
}

interface ForecastData {
  available: boolean;
  location: WeatherLocation;
  current: Omit<CurrentWeather, 'location'>;
  forecast: DailyForecast[];
  source: string;
}

interface WeatherAlert {
  headline: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

interface AlertsData {
  available: boolean;
  alerts: WeatherAlert[];
  source: string;
}

export const fetchCurrentWeather = async (
  city?: string,
  lat?: number,
  lng?: number
): Promise<CurrentWeather | null> => {
  try {
    console.log(`Fetching current weather for: ${city || `${lat},${lng}`}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-weatherapi', {
      body: { city, lat, lng, endpoint: 'current' }
    });

    if (error) {
      console.error("WeatherAPI current weather error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("WeatherAPI current weather unavailable:", data?.error);
      return null;
    }

    console.log("Current weather retrieved successfully");
    return data as CurrentWeather;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return null;
  }
};

export const fetchWeatherForecast = async (
  city?: string,
  lat?: number,
  lng?: number,
  days: number = 7
): Promise<ForecastData | null> => {
  try {
    console.log(`Fetching ${days}-day forecast for: ${city || `${lat},${lng}`}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-weatherapi', {
      body: { city, lat, lng, endpoint: 'forecast', days }
    });

    if (error) {
      console.error("WeatherAPI forecast error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("WeatherAPI forecast unavailable:", data?.error);
      return null;
    }

    console.log("Weather forecast retrieved successfully");
    return data as ForecastData;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return null;
  }
};

export const fetchWeatherAlerts = async (
  city?: string,
  lat?: number,
  lng?: number
): Promise<AlertsData | null> => {
  try {
    console.log(`Fetching weather alerts for: ${city || `${lat},${lng}`}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-weatherapi', {
      body: { city, lat, lng, endpoint: 'alerts' }
    });

    if (error) {
      console.error("WeatherAPI alerts error:", error);
      return null;
    }

    if (data?.error || data?.available === false) {
      console.warn("WeatherAPI alerts unavailable:", data?.error);
      return null;
    }

    console.log("Weather alerts retrieved successfully");
    return data as AlertsData;
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    return null;
  }
};

// Legacy function for backward compatibility
export const fetchWeatherAPIData = async (
  city: string,
  lat?: number,
  lng?: number
): Promise<any> => {
  return fetchCurrentWeather(city, lat, lng);
};
