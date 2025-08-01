import { NextResponse } from 'next/server';
import { getPosts, createPost } from '../../../lib/db';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, userId, categoryId } = await req.json();
  const post = await createPost(title, content, userId, categoryId);
  return NextResponse.json(post);
}
