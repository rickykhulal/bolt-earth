import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Token cache to avoid frequent token requests
let cachedToken: { token: string; expiry: number } | null = null;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const nasaUser = Deno.env.get('NASA_USER');
    const nasaPass = Deno.env.get('NASA_PASS');

    if (!nasaUser || !nasaPass) {
      throw new Error('NASA credentials not configured');
    }

    // Check if we have a valid cached token
    if (cachedToken && cachedToken.expiry > Date.now()) {
      console.log('Using cached NASA token');
      return new Response(JSON.stringify({ token: cachedToken.token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching new NASA Earthdata token');

    // Get OAuth2 token from NASA Earthdata
    const tokenResponse = await fetch('https://urs.earthdata.nasa.gov/api/users/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${nasaUser}:${nasaPass}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`NASA token error: ${tokenResponse.status} - ${errorText}`);
      throw new Error(`Failed to get NASA token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token || tokenData.token;

    if (!token) {
      throw new Error('No token returned from NASA Earthdata');
    }

    // Cache token for 1 hour
    cachedToken = {
      token,
      expiry: Date.now() + 3600000,
    };

    console.log('NASA token generated successfully');

    return new Response(JSON.stringify({ token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nasa-earthdata-token function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
