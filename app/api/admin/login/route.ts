import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, checkPassword, createSessionToken } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (typeof password !== 'string' || !checkPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
  }
}
