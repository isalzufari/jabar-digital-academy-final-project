import { NextResponse } from 'next/server';
import { getTags, addTag } from '../../../lib/db';

export async function GET() {
  const tags = await getTags();
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const newTag = await addTag(name);
  return NextResponse.json(newTag, { status: 201 });
}
