import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city } = await req.json();
    
    if (!city) {
      throw new Error('City name is required');
    }

    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    console.log(`Fetching RapidAPI weather data for city: ${city}`);

    const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${encodeURIComponent(city)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
      },
    });

    if (!response.ok) {
      console.error(`RapidAPI weather error: ${response.status}`);
      return new Response(
        JSON.stringify({
          available: false,
          message: `RapidAPI weather data not available (Status: ${response.status})`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('RapidAPI weather data received:', JSON.stringify(data).substring(0, 200));

    // Extract and validate values
    const sanitizeNumber = (v: any, min: number, max: number) => {
      if (v === null || v === undefined) return null;
      const n = Number(v);
      if (!isFinite(n)) return null;
      if (n === -999 || n === -9999 || n === -99999 || Math.abs(n) > 1e7) return null;
      if (n < min || n > max) return null;
      return n;
    };

    const result = {
      available: true,
      temperature: sanitizeNumber(data.temp, -90, 60),
      feels_like: sanitizeNumber(data.feels_like, -90, 60),
      humidity: sanitizeNumber(data.humidity, 0, 100),
      wind_speed: sanitizeNumber(data.wind_speed, 0, 400), // m/s
      wind_degrees: sanitizeNumber(data.wind_degrees, 0, 360),
      cloud_pct: sanitizeNumber(data.cloud_pct, 0, 100),
      min_temp: sanitizeNumber(data.min_temp, -90, 60),
      max_temp: sanitizeNumber(data.max_temp, -90, 60),
      source: 'RapidAPI - Weather by API Ninjas'
    };

    console.log('RapidAPI weather result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in rapidapi-weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        available: false,
        error: errorMessage,
        message: 'Failed to fetch RapidAPI weather data'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
