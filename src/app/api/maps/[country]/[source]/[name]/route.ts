import { getMaps } from '@/db';

type RouteContext = {
  params: Promise<{
    country: string;
    source: string;
    name: string;
  }>;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string | null) => value !== null && DATE_PATTERN.test(value);

export async function GET(request: Request, context: RouteContext) {
  const { country, source, name } = await context.params;
  const { searchParams } = new URL(request.url);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = searchParams.get('limit');

  if (!limit || !isValidDate(from) || !isValidDate(to)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid required parameters' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const maps = getMaps(country, limit, null, source.toLowerCase(), from, to, name);

  return new Response(JSON.stringify(maps), {
    headers: { 'content-type': 'application/json' },
  });
}
