import { NextResponse } from 'next/server';
import { getPosts, addPost, updatePost, deletePost } from '../../../lib/db';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content, userId, categoryId } = await request.json();
  const newPost = await addPost(title, content, userId, categoryId);
  return NextResponse.json(newPost, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, title, content, categoryId } = await request.json();
  const updatedPost = await updatePost(id, title, content, categoryId);
  return NextResponse.json(updatedPost);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deletePost(id);
  return NextResponse.json({ message: 'Post deleted' });
}
