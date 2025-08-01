import { NextResponse } from 'next/server';
import { getComments, addComment } from '../../../lib/db';

export async function GET() {
  const comments = await getComments();
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const { content, postId, userId } = await request.json();
  const newComment = await addComment(content, postId, userId);
  return NextResponse.json(newComment, { status: 201 });
}
