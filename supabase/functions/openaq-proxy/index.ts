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
    const { lat, lng, radius = 25000, limit = 10 } = await req.json();

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // OpenAQ v3 API - using the latest endpoint
    const url = `https://api.openaq.org/v3/locations?limit=${limit}&radius=${radius}&coordinates=${lat},${lng}&order_by=distance`;

    console.log('Calling OpenAQ v3:', url);

    const resp = await fetch(url, { 
      headers: { 
        Accept: 'application/json',
        'X-API-Key': Deno.env.get('OPENAQ_API_KEY') || '' // Optional API key for higher limits
      } 
    });
    
    if (!resp.ok) {
      const text = await resp.text();
      console.error(`OpenAQ API error: ${resp.status} - ${text}`);
      return new Response(
        JSON.stringify({ 
          error: `OpenAQ API error: ${resp.statusText}`,
          available: false 
        }),
        { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await resp.json();
    console.log('OpenAQ response:', JSON.stringify(data).substring(0, 200));
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in openaq-proxy function:', err);
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});