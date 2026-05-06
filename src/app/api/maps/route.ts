import { getMaps } from '@/db';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const country = searchParams.get('country');
  const since = searchParams.get('since');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const source = searchParams.get('source');
  const name = searchParams.get('name');
  
  if (!limit || !country || !source || (!since && !from && !to)) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const maps = getMaps(country, limit, since, source.toLowerCase(), from, to, name);
  
  return new Response(JSON.stringify(maps), {
    headers: { 'content-type': 'application/json' },
  });
}
