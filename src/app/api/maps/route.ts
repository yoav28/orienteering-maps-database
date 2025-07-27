import { getEvents } from '@/db';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const country = searchParams.get('country');
  const since = searchParams.get('since');
  
  
  if (!limit || !country || !since) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  

  const maps = getEvents(country, limit, since);
  
  return new Response(JSON.stringify(maps), {
    headers: { 'content-type': 'application/json' },
  });
}
