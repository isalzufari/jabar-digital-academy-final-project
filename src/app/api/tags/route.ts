import { NextResponse } from 'next/server';
import { getTags, createTag } from '../../../lib/db';

export async function GET() {
  const tags = await getTags();
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const tag = await createTag(name);
  return NextResponse.json(tag);
}
