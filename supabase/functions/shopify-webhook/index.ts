import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * Geocoding Helper: Maps top global e-commerce cities to rough coordinates.
 * Used as a fallback since Shopify webhooks do not include lat/lng.
 */
function getCoordinates(city: string, country: string) {
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'New York': { lat: 40.7128, lng: -74.0060 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Sao Paulo': { lat: -23.5505, lng: -46.6333 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Seoul': { lat: 37.5665, lng: 126.9780 },
    'Amsterdam': { lat: 52.3676, lng: 4.9041 },
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'Bangkok': { lat: 13.7563, lng: 100.5018 }
  };
  return cityCoordinates[city] || { lat: 0, lng: 0 }; 
}

serve(async (req: Request) => {
  try {
    const rawBody = await req.text();
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const secret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');

    if (!secret || !hmacHeader) {
      return new Response('Unauthorized: Missing Secret or Header', { status: 401 });
    }

    // Calculate HMAC digest in Deno
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const generatedHash = btoa(String.fromCharCode(...new Uint8Array(signature)));

    if (generatedHash !== hmacHeader) {
      return new Response('Unauthorized: Invalid Signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    const shopify_order_id = payload.id?.toString();
    const amount = parseFloat(payload.total_price || '0');
    const currency = payload.currency || 'USD';
    const city = payload.shipping_address?.city || 'Unknown';
    const country = payload.shipping_address?.country || 'Unknown';

    const { lat, lng } = getCoordinates(city, country);

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error } = await supabaseAdmin.from('live_orders').insert({
      shopify_order_id,
      amount,
      currency,
      city,
      country,
      lat,
      lng
    });

    if (error) {
      console.error('Supabase Insert Error:', error);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});
