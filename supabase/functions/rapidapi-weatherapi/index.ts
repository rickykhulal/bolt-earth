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
    const { city, lat, lng, endpoint = 'current' } = await req.json();
    const apiKey = Deno.env.get('RAPIDAPI_WEATHER_ALT_KEY');

    if (!apiKey) {
      console.error("Missing RAPIDAPI_WEATHER_ALT_KEY");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build location query
    let location = city || `${lat},${lng}`;
    
    // Build URL based on endpoint type
    let url: string;
    const baseUrl = 'https://weatherapi-com.p.rapidapi.com';
    
    switch (endpoint) {
      case 'forecast':
        url = `${baseUrl}/forecast.json?q=${encodeURIComponent(location)}&days=7`;
        break;
      case 'alerts':
        url = `${baseUrl}/alerts.json?q=${encodeURIComponent(location)}`;
        break;
      case 'astronomy':
        url = `${baseUrl}/astronomy.json?q=${encodeURIComponent(location)}`;
        break;
      case 'current':
      default:
        url = `${baseUrl}/current.json?q=${encodeURIComponent(location)}`;
        break;
    }

    console.log(`Fetching WeatherAPI ${endpoint} for: ${location}`);

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WeatherAPI error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({
          available: false,
          error: `WeatherAPI returned ${response.status}`
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    // Process based on endpoint
    if (endpoint === 'forecast') {
      return new Response(
        JSON.stringify({
          available: true,
          location: data.location,
          current: {
            temperature: data.current?.temp_c,
            feels_like: data.current?.feelslike_c,
            humidity: data.current?.humidity,
            wind_speed: data.current?.wind_kph,
            wind_direction: data.current?.wind_dir,
            pressure: data.current?.pressure_mb,
            visibility: data.current?.vis_km,
            cloud_cover: data.current?.cloud,
            uv_index: data.current?.uv,
            condition: data.current?.condition?.text,
            condition_icon: data.current?.condition?.icon,
            is_day: data.current?.is_day
          },
          forecast: data.forecast?.forecastday?.map((day: any) => ({
            date: day.date,
            max_temp: day.day?.maxtemp_c,
            min_temp: day.day?.mintemp_c,
            avg_temp: day.day?.avgtemp_c,
            condition: day.day?.condition?.text,
            condition_icon: day.day?.condition?.icon,
            precipitation_chance: day.day?.daily_chance_of_rain,
            humidity: day.day?.avghumidity,
            uv_index: day.day?.uv,
            sunrise: day.astro?.sunrise,
            sunset: day.astro?.sunset,
            hourly: day.hour?.map((hour: any) => ({
              time: hour.time,
              temp: hour.temp_c,
              condition: hour.condition?.text,
              icon: hour.condition?.icon,
              precipitation_chance: hour.chance_of_rain
            }))
          })),
          source: 'WeatherAPI.com'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (endpoint === 'alerts') {
      return new Response(
        JSON.stringify({
          available: true,
          alerts: data.alerts?.alert || [],
          source: 'WeatherAPI.com'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Current weather
      return new Response(
        JSON.stringify({
          available: true,
          temperature: data.current?.temp_c,
          feels_like: data.current?.feelslike_c,
          humidity: data.current?.humidity,
          wind_speed: data.current?.wind_kph,
          wind_direction: data.current?.wind_dir,
          pressure: data.current?.pressure_mb,
          visibility: data.current?.vis_km,
          cloud_cover: data.current?.cloud,
          uv_index: data.current?.uv,
          condition: data.current?.condition?.text,
          condition_icon: data.current?.condition?.icon,
          is_day: data.current?.is_day,
          location: {
            name: data.location?.name,
            region: data.location?.region,
            country: data.location?.country,
            lat: data.location?.lat,
            lon: data.location?.lon,
            localtime: data.location?.localtime
          },
          source: 'WeatherAPI.com'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in rapidapi-weatherapi function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
