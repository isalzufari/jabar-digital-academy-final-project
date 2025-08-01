import { NextResponse } from 'next/server';
import { getUsers, createUser } from '../../../lib/db';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const newUser = await createUser(name, email, password, role);
  return NextResponse.json(newUser);
}
