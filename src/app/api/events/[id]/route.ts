import {NextResponse} from 'next/server';
import {getEventById} from '@/db';


type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};


export async function GET(request: Request, context: RouteContext) {
  const {id} = await context.params;
  const event = getEventById(parseInt(id, 10));

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, {
      status: 404,
    });
  }

  return NextResponse.json(event);
}
