import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'involynk-default-secret-key-123456';

// Helper to sign the session token
function signToken(payload) {
  const data = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('hex');
  return Buffer.from(JSON.stringify({ data, signature })).toString('base64');
}

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Create session payload expiring in 24 hours
    const payload = {
      username: user.username,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    const token = signToken(payload);
    
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    
    // Set secure HTTP-only session cookie
    response.cookies.set('involynk_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}

// Check current session status
export async function GET(req) {
  const cookieStore = req.cookies;
  const tokenCookie = cookieStore.get('involynk_session');

  if (!tokenCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const raw = Buffer.from(tokenCookie.value, 'base64').toString('utf-8');
    const { data, signature } = JSON.parse(raw);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = JSON.parse(data);
    
    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return NextResponse.json({ authenticated: false, message: 'Session expired' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, username: payload.username });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// Log out and clear session cookie
export async function DELETE(req) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('involynk_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
