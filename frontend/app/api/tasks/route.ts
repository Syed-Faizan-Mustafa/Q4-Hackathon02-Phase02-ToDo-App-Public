import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to get session token from cookies
async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  // Better Auth stores the session token in this cookie as "token.signature"
  // We need to extract just the token part (before the dot) for database lookup
  const sessionCookie = cookieStore.get('better-auth.session_token');
  if (!sessionCookie?.value) return null;

  // Extract the token part (before the signature)
  const tokenParts = sessionCookie.value.split('.');
  return tokenParts[0] || null;
}

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
