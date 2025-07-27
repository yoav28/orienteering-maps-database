import {getCountries, getMaps} from '@/db';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const countries = getCountries();
  
  return new Response(JSON.stringify(countries), {
    headers: { 'content-type': 'application/json' },
  });
}
