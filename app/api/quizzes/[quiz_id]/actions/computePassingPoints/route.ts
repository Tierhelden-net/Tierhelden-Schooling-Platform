import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from "@clerk/nextjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { quiz_id: string } }
) {
  try {
    // Benutzer-Authentifizierung
    const { userId } = auth();

    // Falls der Benutzer nicht angemeldet ist, wird eine Fehlermeldung zurückgegeben
    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Benutzerrolle abrufen
    const user = await db.user.findUnique({
      where: { user_id: userId },
      select: { user_role: true },
    });

    // Falls der Benutzer keine Adminrechte hat, wird eine Fehlermeldung zurückgegeben
    if (!user || user.user_role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Prozentsatz zum Bestehen des Quiz abrufen
    const passingPercentageRaw = await request.json();

    // Falls kein Prozentsatz zum Bestehen des Quiz gefunden wurde, wird eine Fehlermeldung zurückgegeben
    if (!passingPercentageRaw) {
        return NextResponse.json(
          { error: 'No Passing Percentage Found.' },
          { status: 400 }
        );
      }

    // Prozentsatz zum Bestehen des Quiz als Ganzzahl parsen
    // Prozentsatz sollte zwischen 0 und 100 liegen
    const passingPercentage = parseInt(passingPercentageRaw, 10);

    // Falls der Prozentsatz zum Bestehen des Quiz nicht zwischen 0 und 100 liegt, wird eine Fehlermeldung zurückgegeben
    if (passingPercentage < 0 || passingPercentage > 100) {
        return NextResponse.json(
            { error: 'Passing percentage should be between 0 and 100.' },
            { status: 400 }
        );
    }

    // Extrahiere und parse QuizID als Integer
    const quizId = parseInt(params.quiz_id, 10);

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quizId) {
      return NextResponse.json(
        { error: 'Invalid quiz_id.' },
        { status: 400 }
      );
    }

    // Quiz abrufen
    const quiz = await db.quiz.findUnique({
      where: { quiz_id: quizId },
    });

    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found.' },
        { status: 404 }
      );
    }

    // Maximale Punktzahl des Quiz abrufen
    const maxPoints = quiz.max_points;

    // Falls die maximale Punktzahl des Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if(!maxPoints) {
        return NextResponse.json('Max points not found.', 
        { status: 404 });
    }

    // Berechne die Punktzahl, die zum Bestehen des Quizzes erforderlich ist
    // Es wird abgerundet auf die nächste ganze Zahl
    const passingPoints = Math.floor(maxPoints * passingPercentage / 100);

    // Quiz aktualisieren
    await db.quiz.update({
      where: { quiz_id: quizId },
      data: { max_points: maxPoints },
    });

    return NextResponse.json(
      { message: 'Max points updated successfully.', maxPoints },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}