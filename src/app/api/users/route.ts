import { NextResponse } from 'next/server';
import { getUsers, createUser } from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser(name, email, hashedPassword, role);
  return NextResponse.json(newUser);
}
