import { NextResponse } from 'next/server';
import { getPosts, createPost } from '../../../lib/db';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { title, content, userId, categoryId } = await req.json();
  const post = await createPost(title, content, userId, categoryId);
  return NextResponse.json(post);
}
