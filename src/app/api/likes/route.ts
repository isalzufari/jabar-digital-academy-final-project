import { NextResponse } from 'next/server';
import { getLikesByPostId, addLike, removeLike } from '../../../lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId)
    return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const likes = await getLikesByPostId(Number(postId));
  return NextResponse.json(likes);
}

export async function POST(req: Request) {
  const { postId, userId } = await req.json();
  const like = await addLike(postId, userId);
  return NextResponse.json(like);
}

export async function DELETE(req: Request) {
  const { postId, userId } = await req.json();
  await removeLike(postId, userId);
  return NextResponse.json({ message: 'Like removed' });
}
