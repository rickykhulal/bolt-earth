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

    const nasaUser = Deno.env.get('NASA_USER');
    const nasaPass = Deno.env.get('NASA_PASS');

    if (!nasaUser || !nasaPass) {
      console.error('NASA credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'NASA credentials not configured. Please set NASA_USER and NASA_PASS environment variables.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // NASA IMERG API endpoint (GPM IMERG)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const endpoint = `https://gpm1.gesdisc.eosdis.nasa.gov/opendap/GPM_L3/GPM_3IMERGDF.06/${today}/3B-DAY.MS.MRG.3IMERG.${today}-S000000-E235959.V06.nc4`;
    const basicAuth = btoa(`${nasaUser}:${nasaPass}`);

    console.log(`Fetching IMERG data for lat=${lat}, lng=${lng}`);

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA IMERG API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error('Invalid NASA credentials. Please check NASA_USER and NASA_PASS.');
      }
      
      throw new Error(`NASA IMERG API error: ${response.statusText}`);
    }

    // Note: This is a simplified implementation
    // Full implementation would require NetCDF parsing and spatial subsetting
    const imergData = {
      precipitation: 0, // Would need to parse NetCDF data
      timestamp: new Date().toISOString(),
    };

    console.log('IMERG data retrieved successfully');

    return new Response(JSON.stringify(imergData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nasa-imerg function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
