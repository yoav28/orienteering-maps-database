import { getEventById } from '@/db';
import {NextResponse} from 'next/server';

export async function GET(request: Request, context: any) {
  const event = getEventById(parseInt(context.params.id, 10));

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, {
      status: 404,
    });
  }

  return NextResponse.json(event);
}