import { NextResponse } from 'next/server';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../../../lib/db';

export async function GET(request: Request) {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();
  const newUser = await addUser(name, email, password, role);
  return NextResponse.json(newUser, { status: 201 });
}
