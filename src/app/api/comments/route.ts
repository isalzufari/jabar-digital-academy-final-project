import { NextResponse } from 'next/server';
import { getCommentsByPostId, createComment } from '../../../lib/db';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId)
    return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const comments = await getCommentsByPostId(Number(postId));
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const { content, postId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const comment = await createComment(content, postId, userId);

  return NextResponse.json(comment, { status: 201 });
}
