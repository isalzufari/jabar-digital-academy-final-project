import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

type Params = { params: { id: string } };

export async function GET(request: Request, context: any) {
  const { id } = context.params; // params.id dari URL
  const post = await getPostById(Number(id));
  if (!post)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, context: any) {
  const { id } = context.params; // params.id dari URL
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, categoryId } = await req.json();
  const post = await updatePost(Number(id), title, content, categoryId);
  return NextResponse.json(post);
}

export async function DELETE(req: Request, context: any) {
  const { id } = context.params; // params.id dari URL
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deletePost(Number(id));
  return NextResponse.json({ message: 'Post deleted' });
}
