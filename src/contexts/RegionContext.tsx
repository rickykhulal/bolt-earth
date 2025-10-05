import { createContext, useContext, useState, ReactNode } from "react";
import { AirQualityData, mockAirQualityData } from "@/lib/mockData";
import { fetchOpenAQData } from "@/services/openaq";
import { fetchTempoData } from "@/services/nasaTempo";
import { fetchDaymetData } from "@/services/daymet";
import { fetchImergData } from "@/services/imerg";
import { fetchPowerData } from "@/services/nasaPower";
import { fetchRapidAPIAirQuality, fetchRapidAPIWeather } from "@/services/rapidapi";
import { fetchWeatherAPIData } from "@/services/rapidapiWeatherAPI";
import { fetchCustomWeatherData } from "@/services/customWeather";
import { fetchMeteostatData } from "@/services/meteostat";
import { sanitizeNumber, computeAQI } from "@/lib/utils";

interface RegionContextType {
  selectedRegion: AirQualityData | null;
  setSelectedRegion: (region: AirQualityData | null) => void;
  loading: boolean;
  error: string | null;
  fetchRegionData: (lat: number, lng: number, cityName?: string) => Promise<void>;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionData = async (lat: number, lng: number, cityName?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Helper: Check if two values agree within threshold (±15-20%)
      const valuesAgree = (v1: number, v2: number, threshold = 0.20): boolean => {
        const avg = (v1 + v2) / 2;
        const diff = Math.abs(v1 - v2);
        return diff / avg <= threshold;
      };

      // Helper: Blend multiple values (prefer NASA, then RapidAPI, then custom, or average if multiple agree)
      const blendValues = (values: number[], threshold = 0.20): number | null => {
        if (values.length === 0) return null;
        if (values.length === 1) return values[0];
        if (values.length === 2) {
          return valuesAgree(values[0], values[1], threshold) 
            ? (values[0] + values[1]) / 2 
            : values[0]; // Prefer first (NASA)
        }
        // For 3+ values, check if at least 2 agree
        for (let i = 0; i < values.length - 1; i++) {
          for (let j = i + 1; j < values.length; j++) {
            if (valuesAgree(values[i], values[j], threshold)) {
              return (values[i] + values[j]) / 2;
            }
          }
        }
        return values[0]; // Default to first (NASA)
      };

      // Helper: Get best value from sources (prefer NASA, then others, or blend)
      const getBestValue = (sources: { value: number | null, name: string }[]): number | null => {
        const validValues = sources.filter(s => s.value !== null && s.value !== undefined).map(s => s.value as number);
        return blendValues(validValues);
      };

      // Fetch data from multiple sources in parallel
      const [openaqData, tempoData, daymetData, imergData, powerData, rapidAQData, rapidWeatherData, weatherAPIData, customWeatherData, meteostatData] = await Promise.all([
        fetchOpenAQData(lat, lng),
        fetchTempoData(lat, lng),
        fetchDaymetData(lat, lng),
        fetchImergData(lat, lng),
        fetchPowerData(lat, lng),
        fetchRapidAPIAirQuality(cityName || ""),
        fetchRapidAPIWeather(cityName || ""),
        fetchWeatherAPIData(cityName || "", lat, lng),
        fetchCustomWeatherData(lat, lng),
        fetchMeteostatData(lat, lng),
      ]);

      // Blend temperature from multiple sources
      const tempSources = [
        { value: meteostatData?.temperature, name: "Meteostat" },
        { value: powerData?.temperature, name: "NASA POWER" },
        { value: daymetData ? (daymetData.tmax + daymetData.tmin) / 2 : null, name: "NASA Daymet" },
        { value: rapidWeatherData?.temperature, name: "RapidAPI Weather" },
        { value: weatherAPIData?.temperature, name: "WeatherAPI" },
        { value: customWeatherData?.temperature, name: "Custom Weather API" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedTemp = getBestValue(tempSources);

      // Blend humidity
      const humiditySources = [
        { value: meteostatData?.humidity, name: "Meteostat" },
        { value: powerData?.humidity, name: "NASA POWER" },
        { value: rapidWeatherData?.humidity, name: "RapidAPI Weather" },
        { value: weatherAPIData?.humidity, name: "WeatherAPI" },
        { value: customWeatherData?.humidity, name: "Custom Weather API" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedHumidity = getBestValue(humiditySources);

      // Blend wind speed (convert km/h to m/s for WeatherAPI, Meteostat already in m/s)
      const windSources = [
        { value: meteostatData?.windSpeed, name: "Meteostat" },
        { value: powerData?.windSpeed, name: "NASA POWER" },
        { value: rapidWeatherData?.wind_speed, name: "RapidAPI Weather" },
        { value: weatherAPIData?.wind_speed ? weatherAPIData.wind_speed / 3.6 : null, name: "WeatherAPI" },
        { value: customWeatherData?.windSpeed, name: "Custom Weather API" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedWindSpeed = getBestValue(windSources);

      // Blend PM2.5
      const pm25Sources = [
        { value: openaqData?.pollutants?.pm25, name: "OpenAQ" },
        { value: rapidAQData?.PM2?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedPM25 = getBestValue(pm25Sources);

      // Blend PM10
      const pm10Sources = [
        { value: openaqData?.pollutants?.pm10, name: "OpenAQ" },
        { value: rapidAQData?.PM10?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedPM10 = getBestValue(pm10Sources);

      // Blend NO2
      const no2Sources = [
        { value: tempoData?.no2, name: "NASA TEMPO" },
        { value: openaqData?.pollutants?.no2, name: "OpenAQ" },
        { value: rapidAQData?.NO2?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedNO2 = getBestValue(no2Sources);

      // Blend Ozone
      const ozoneSources = [
        { value: tempoData?.ozone, name: "NASA TEMPO" },
        { value: openaqData?.pollutants?.ozone, name: "OpenAQ" },
        { value: rapidAQData?.O3?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedOzone = getBestValue(ozoneSources);

      // Blend SO2
      const so2Sources = [
        { value: openaqData?.pollutants?.so2, name: "OpenAQ" },
        { value: rapidAQData?.SO2?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedSO2 = getBestValue(so2Sources);

      // Blend CO
      const coSources = [
        { value: openaqData?.pollutants?.co, name: "OpenAQ" },
        { value: rapidAQData?.CO?.concentration, name: "RapidAPI AQ" }
      ].filter(s => s.value !== null && s.value !== undefined);
      
      const blendedCO = getBestValue(coSources);

      // Sanitize all final values
      const temp = sanitizeNumber(blendedTemp, { min: -90, max: 60 });
      const humidity = sanitizeNumber(blendedHumidity, { min: 0, max: 100 });
      const windSpeed = sanitizeNumber(blendedWindSpeed, { min: 0, max: 400 });
      const pm25 = sanitizeNumber(blendedPM25, { min: 0, max: 10000 });
      const pm10 = sanitizeNumber(blendedPM10, { min: 0, max: 10000 });
      const no2 = sanitizeNumber(blendedNO2, { min: 0, max: 10000 });
      const ozone = sanitizeNumber(blendedOzone, { min: 0, max: 10000 });
      const so2 = sanitizeNumber(blendedSO2, { min: 0, max: 10000 });
      const co = sanitizeNumber(blendedCO, { min: 0, max: 100000 });
      const precipitation = sanitizeNumber(
        imergData?.precipitation ?? powerData?.precipitation,
        { min: 0, max: 1000 }
      );

      // Track which sources were actually used
      const usedSources = new Set<string>();
      if (tempSources.length > 0) tempSources.forEach(s => usedSources.add(s.name));
      if (humiditySources.length > 0) humiditySources.forEach(s => usedSources.add(s.name));
      if (windSources.length > 0) windSources.forEach(s => usedSources.add(s.name));
      if (pm25Sources.length > 0) pm25Sources.forEach(s => usedSources.add(s.name));
      if (no2Sources.length > 0) no2Sources.forEach(s => usedSources.add(s.name));
      if (tempoData && tempoData.available !== false) usedSources.add("NASA TEMPO");
      if (imergData) usedSources.add("NASA IMERG");
      
      // Simplify source names for cleaner display
      const simplifiedSources = Array.from(usedSources).map(s => {
        if (s.includes("RapidAPI")) return "RapidAPI";
        if (s.includes("WeatherAPI")) return "WeatherAPI";
        if (s.includes("Meteostat")) return "Meteostat";
        if (s.includes("NASA")) return "NASA";
        if (s.includes("OpenAQ")) return "OpenAQ";
        return s;
      });
      const uniqueSources = Array.from(new Set(simplifiedSources));
      const sourceString = uniqueSources.join(" + ");
      const hasBlending = tempSources.length > 1 || humiditySources.length > 1 || pm25Sources.length > 1;
      const finalSource = hasBlending ? `${sourceString} (blended)` : sourceString;

      // Calculate AQI
      const aqiResult = computeAQI(pm25, pm10);
      let calculatedAqi = aqiResult.aqi || sanitizeNumber(openaqData?.aqi, { min: 0, max: 500 });
      
      // Use RapidAPI AQI if others unavailable
      if ((!calculatedAqi || calculatedAqi === 0) && rapidAQData?.overall_aqi) {
        calculatedAqi = sanitizeNumber(rapidAQData.overall_aqi, { min: 0, max: 500 });
      }

      const mergedData: AirQualityData = {
        city: openaqData?.city || cityName || "Unknown Location",
        country: openaqData?.country || "",
        lat: openaqData?.lat || lat,
        lng: openaqData?.lng || lng,
        aqi: calculatedAqi || 0,
        pollutants: {
          no2: no2 || 0,
          pm25: pm25 || 0,
          pm10: pm10 || 0,
          ozone: ozone || 0,
          so2: so2 || 0,
          co: co || 0,
        },
        weather: {
          temp: temp,
          humidity: humidity,
          windSpeed: windSpeed,
          condition: precipitation && precipitation > 0 ? "Rainy" : "Clear",
        },
        lastUpdated: new Date().toISOString(),
        dataSource: finalSource || "Multiple Sources",
      };

      setSelectedRegion(mergedData);
    } catch (err) {
      console.error("Error fetching region data:", err);
      setError("Failed to fetch air quality data. Please try again.");
      setSelectedRegion(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        loading,
        error,
        fetchRegionData,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return context;
};
