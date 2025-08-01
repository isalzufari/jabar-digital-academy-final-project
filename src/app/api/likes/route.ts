import { NextResponse } from 'next/server';
import { getLikesByPostId, addLike, removeLike } from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId)
    return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const likes = await getLikesByPostId(Number(postId));
  return NextResponse.json(likes);
}

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const like = await addLike(postId, userId);
  return NextResponse.json(like);
}

export async function DELETE(req: Request) {
  const { postId, userId } = await req.json();
  await removeLike(postId, userId);
  return NextResponse.json({ message: 'Like removed' });
}
