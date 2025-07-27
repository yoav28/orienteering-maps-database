import { getMaps } from '@/db';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const country = searchParams.get('country');
  const since = searchParams.get('since');
  const source = searchParams.get('source');
  
  
  if (!limit || !country || !since || !source) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  

  const maps = getMaps(country, limit, since, source.toLowerCase());
  
  return new Response(JSON.stringify(maps), {
    headers: { 'content-type': 'application/json' },
  });
}
