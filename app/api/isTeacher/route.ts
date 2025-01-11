// Test: http://localhost:3000/api/userRole?userId=user_2qRFohM2BAVLUMOj7YYF6TsgIv7
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { auth } from "@clerk/nextjs";

export async function GET(request: NextRequest) {
  try {
    
    // const { searchParams } = new URL(request.url);
    // const userId = searchParams.get('userId');
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // Datenbankabfrage: Benutzerrolle aus Tabelle users abrufen
    const user = await db.user.findUnique({
      where: { user_id: userId },
      select: { user_role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.user_role === 'ADMIN') {
        return NextResponse.json(true);
    } 

    // Rolle als JSON zurückgeben
    return NextResponse.json(false);
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
