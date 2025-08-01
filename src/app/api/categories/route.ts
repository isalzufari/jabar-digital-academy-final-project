import { NextResponse } from 'next/server';
import { getCategories, addCategory } from '@/lib/db';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const { name, description } = await request.json();
  const newCategory = await addCategory(name, description);
  return NextResponse.json(newCategory, { status: 201 });
}