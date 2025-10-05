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
    
    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    console.log(`Fetching NASA POWER data for lat=${lat}, lng=${lng}`);

    // Get date range (yesterday and today)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const startDate = formatDate(yesterday);
    const endDate = formatDate(today);

    // NASA POWER API endpoint
    const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,RH2M,PRECTOTCORR,WS2M&community=RE&longitude=${lng}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;

    console.log(`Calling NASA POWER API: ${powerUrl}`);

    const response = await fetch(powerUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`NASA POWER API error: ${response.status}`);
      return new Response(
        JSON.stringify({
          available: false,
          message: `NASA POWER data not available for this location (Status: ${response.status})`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('NASA POWER data received:', JSON.stringify(data).substring(0, 200));

    // Extract parameters
    const parameters = data.properties?.parameter;
    
    if (!parameters) {
      return new Response(
        JSON.stringify({
          available: false,
          message: 'NASA POWER data structure unexpected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the most recent date's data
    const dates = Object.keys(parameters.T2M || {}).sort().reverse();
    const latestDate = dates[0];
    
    if (!latestDate) {
      return new Response(
        JSON.stringify({
          available: false,
          message: 'No recent data available from NASA POWER'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract values (T2M is in Celsius, RH2M is percentage, PRECTOTCORR is mm/day, WS2M is m/s)
    const temperature = parameters.T2M?.[latestDate];
    const humidity = parameters.RH2M?.[latestDate];
    const precipitation = parameters.PRECTOTCORR?.[latestDate];
    const windSpeed = parameters.WS2M?.[latestDate];

    // Sanitize values - detect sentinel values like -999
    const sanitizeNumber = (v: any, min: number, max: number) => {
      if (v === null || v === undefined) return null;
      const n = Number(v);
      if (!isFinite(n)) return null;
      // Common sentinel values
      if (n === -999 || n === -9999 || n === -99999 || Math.abs(n) > 1e7) return null;
      if (n < min || n > max) return null;
      return n;
    };

    const tempSanitized = sanitizeNumber(temperature, -90, 60);
    const humiditySanitized = sanitizeNumber(humidity, 0, 100);
    const precipSanitized = sanitizeNumber(precipitation, 0, 1000);
    const windSanitized = sanitizeNumber(windSpeed, 0, 400);

    // Convert wind speed from m/s to km/h if valid
    const windSpeedKmh = windSanitized !== null ? Math.round(windSanitized * 3.6) : null;

    // Check if we have any valid data
    const hasValidData = tempSanitized !== null || humiditySanitized !== null || 
                         precipSanitized !== null || windSpeedKmh !== null;

    if (!hasValidData) {
      return new Response(
        JSON.stringify({
          available: false,
          message: 'NASA POWER data contains only invalid/sentinel values for this location'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      available: true,
      temperature: tempSanitized !== null ? Math.round(tempSanitized) : null,
      humidity: humiditySanitized !== null ? Math.round(humiditySanitized) : null,
      precipitation: precipSanitized !== null ? Math.round(precipSanitized * 10) / 10 : null,
      windSpeed: windSpeedKmh,
      timestamp: latestDate,
      message: 'Data from NASA POWER API'
    };

    console.log('NASA POWER result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nasa-power function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        available: false,
        error: errorMessage,
        message: 'Failed to fetch NASA POWER data'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
