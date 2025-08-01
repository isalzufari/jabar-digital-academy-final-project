import { NextResponse } from 'next/server';
import { getCommentsByPostId, createComment } from '../../../lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId)
    return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const comments = await getCommentsByPostId(Number(postId));
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const { content, postId, userId } = await req.json();
  const comment = await createComment(content, postId, userId);
  return NextResponse.json(comment);
}
