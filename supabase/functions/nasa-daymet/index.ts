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

    const currentYear = new Date().getFullYear();
    const endpoint = `https://daymet.ornl.gov/single-pixel/api/data`;

    console.log(`Fetching Daymet data for lat=${lat}, lng=${lng}`);

    const response = await fetch(
      `${endpoint}?lat=${lat}&lon=${lng}&vars=tmax,tmin,prcp&start=${currentYear}&end=${currentYear}&format=json`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA Daymet API error: ${response.status} - ${errorText}`);
      throw new Error(`NASA Daymet API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Defensive parsing: support different JSON layouts
    const series = (data && (data.data || data.Data || data)) as Record<string, unknown>;
    const tmaxArr = Array.isArray((series as any)?.tmax)
      ? (series as any).tmax
      : Array.isArray((series as any)?.['tmax (deg c)'])
        ? (series as any)['tmax (deg c)']
        : null;
    const tminArr = Array.isArray((series as any)?.tmin)
      ? (series as any).tmin
      : Array.isArray((series as any)?.['tmin (deg c)'])
        ? (series as any)['tmin (deg c)']
        : null;
    const prcpArr = Array.isArray((series as any)?.prcp)
      ? (series as any).prcp
      : Array.isArray((series as any)?.['prcp (mm/day)'])
        ? (series as any)['prcp (mm/day)']
        : null;

    if (!tmaxArr || !tminArr || !prcpArr || tmaxArr.length === 0) {
      throw new Error('Unexpected Daymet response format');
    }

    const latestIndex = tmaxArr.length - 1;

    const daymetData = {
      tmax: Number(tmaxArr[latestIndex]),
      tmin: Number(tminArr[latestIndex]),
      prcp: Number(prcpArr[latestIndex]),
      timestamp: new Date().toISOString(),
    };

    console.log('Daymet data retrieved successfully');

    return new Response(JSON.stringify(daymetData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nasa-daymet function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
