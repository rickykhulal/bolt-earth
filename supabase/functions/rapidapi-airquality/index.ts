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

    console.log(`Fetching RapidAPI air quality data for city: ${city}`);

    const url = `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${encodeURIComponent(city)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
      },
    });

    if (!response.ok) {
      console.error(`RapidAPI air quality error: ${response.status}`);
      return new Response(
        JSON.stringify({
          available: false,
          message: `RapidAPI air quality data not available (Status: ${response.status})`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('RapidAPI air quality data received:', JSON.stringify(data).substring(0, 200));

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
      overall_aqi: sanitizeNumber(data.overall_aqi, 0, 500),
      CO: {
        concentration: sanitizeNumber(data.CO?.concentration, 0, 100000),
        aqi: sanitizeNumber(data.CO?.aqi, 0, 500)
      },
      NO2: {
        concentration: sanitizeNumber(data.NO2?.concentration, 0, 10000),
        aqi: sanitizeNumber(data.NO2?.aqi, 0, 500)
      },
      O3: {
        concentration: sanitizeNumber(data.O3?.concentration, 0, 10000),
        aqi: sanitizeNumber(data.O3?.aqi, 0, 500)
      },
      PM2: {
        concentration: sanitizeNumber(data['PM2.5']?.concentration, 0, 10000),
        aqi: sanitizeNumber(data['PM2.5']?.aqi, 0, 500)
      },
      PM10: {
        concentration: sanitizeNumber(data.PM10?.concentration, 0, 10000),
        aqi: sanitizeNumber(data.PM10?.aqi, 0, 500)
      },
      SO2: {
        concentration: sanitizeNumber(data.SO2?.concentration, 0, 10000),
        aqi: sanitizeNumber(data.SO2?.aqi, 0, 500)
      },
      source: 'RapidAPI - Air Quality by API Ninjas'
    };

    console.log('RapidAPI air quality result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in rapidapi-airquality function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        available: false,
        error: errorMessage,
        message: 'Failed to fetch RapidAPI air quality data'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
