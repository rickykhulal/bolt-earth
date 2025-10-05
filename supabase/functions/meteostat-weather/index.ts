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
    const { lat, lng } = await req.json();
    console.log(`Fetching Meteostat data for lat=${lat}, lng=${lng}`);

    const apiKey = Deno.env.get('RAPIDAPI_WEATHER_ALT_KEY');
    if (!apiKey) {
      throw new Error('RAPIDAPI_WEATHER_ALT_KEY not configured');
    }

    // Get data for the last 24 hours
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const start = yesterday.toISOString().split('T')[0];
    const end = now.toISOString().split('T')[0];

    const url = `https://meteostat.p.rapidapi.com/point/hourly?lat=${lat}&lon=${lng}&start=${start}&end=${end}`;
    
    console.log(`Meteostat API URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'meteostat.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Meteostat API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ 
          available: false, 
          error: `API returned ${response.status}`,
          message: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Meteostat raw response:', JSON.stringify(data));

    // Get the most recent hourly data point
    if (!data.data || data.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          available: false, 
          message: 'No data available for this location'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const latest = data.data[data.data.length - 1];

    const sanitizeNumber = (value: any): number | null => {
      if (value === null || value === undefined) return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    const result = {
      available: true,
      temperature: sanitizeNumber(latest.temp),
      humidity: sanitizeNumber(latest.rhum),
      windSpeed: sanitizeNumber(latest.wspd),
      pressure: sanitizeNumber(latest.pres),
      precipitation: sanitizeNumber(latest.prcp),
      timestamp: latest.time,
      source: 'Meteostat'
    };

    console.log('Meteostat processed data:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Meteostat function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        available: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
