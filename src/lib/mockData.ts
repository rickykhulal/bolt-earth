// Mock data for air quality and weather
export interface AirQualityData {
  lat: number;
  lng: number;
  city: string;
  country?: string;
  aqi: number;
  category?: "good" | "moderate" | "unhealthy-sensitive" | "unhealthy" | "very-unhealthy" | "hazardous";
  pollutants: {
    no2: number;
    pm25: number;
    pm10?: number;
    ozone: number;
    so2?: number;
    co?: number;
  };
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition?: string;
  };
  lastUpdated?: string;
  dataSource?: string;
}

export const mockAirQualityData: AirQualityData[] = [
  {
    lat: 40.7128,
    lng: -74.0060,
    city: "New York",
    aqi: 45,
    category: "good",
    pollutants: { no2: 28, pm25: 35, ozone: 42 },
    weather: { temp: 22, humidity: 65, windSpeed: 12 },
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    city: "Los Angeles",
    aqi: 85,
    category: "moderate",
    pollutants: { no2: 65, pm25: 78, ozone: 92 },
    weather: { temp: 28, humidity: 45, windSpeed: 8 },
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: "London",
    aqi: 52,
    category: "moderate",
    pollutants: { no2: 48, pm25: 45, ozone: 38 },
    weather: { temp: 18, humidity: 72, windSpeed: 15 },
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    city: "Tokyo",
    aqi: 38,
    category: "good",
    pollutants: { no2: 22, pm25: 28, ozone: 35 },
    weather: { temp: 24, humidity: 68, windSpeed: 10 },
  },
  {
    lat: 28.6139,
    lng: 77.2090,
    city: "New Delhi",
    aqi: 165,
    category: "unhealthy",
    pollutants: { no2: 142, pm25: 178, ozone: 125 },
    weather: { temp: 32, humidity: 58, windSpeed: 6 },
  },
];

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return "hsl(var(--air-good))";
  if (aqi <= 100) return "hsl(var(--air-moderate))";
  if (aqi <= 150) return "hsl(var(--air-unhealthy-sensitive))";
  if (aqi <= 200) return "hsl(var(--air-unhealthy))";
  if (aqi <= 300) return "hsl(var(--air-very-unhealthy))";
  return "hsl(var(--air-hazardous))";
};

export const getAQILabel = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export const mockForecastData = [
  { date: "Mon", aqi: 45, no2: 28, pm25: 35 },
  { date: "Tue", aqi: 52, no2: 35, pm25: 42 },
  { date: "Wed", aqi: 48, no2: 32, pm25: 38 },
  { date: "Thu", aqi: 65, no2: 45, pm25: 58 },
  { date: "Fri", aqi: 72, no2: 52, pm25: 65 },
  { date: "Sat", aqi: 58, no2: 38, pm25: 48 },
  { date: "Sun", aqi: 42, no2: 28, pm25: 35 },
];

export const whoGuidelines = [
  {
    pollutant: "NO₂ (Nitrogen Dioxide)",
    limit: "40 µg/m³ annual",
    health: "Respiratory irritation, reduced lung function",
  },
  {
    pollutant: "PM2.5 (Fine Particulate Matter)",
    limit: "15 µg/m³ annual",
    health: "Cardiovascular and respiratory diseases",
  },
  {
    pollutant: "O₃ (Ozone)",
    limit: "100 µg/m³ 8-hour",
    health: "Breathing problems, aggravates asthma",
  },
];
