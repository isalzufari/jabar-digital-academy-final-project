import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '../../../lib/db';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name, description } = await req.json();
  const category = await createCategory(name, description);
  return NextResponse.json(category);
}
