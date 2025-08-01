import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const post = await getPostById(Number(params.id));
  if (!post)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, categoryId } = await req.json();
  const post = await updatePost(Number(params.id), title, content, categoryId);
  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deletePost(Number(params.id));
  return NextResponse.json({ message: 'Post deleted' });
}
