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

// GET /api/tasks/[taskId] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
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
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
      method: 'PUT',
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[taskId] - Partially update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
      method: 'PATCH',
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session token found' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
