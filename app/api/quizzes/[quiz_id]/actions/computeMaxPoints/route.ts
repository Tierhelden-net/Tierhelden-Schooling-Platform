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

    if (!user || user.user_role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Extrahiere und parse Quiz-ID
    const quizId = parseInt(params.quiz_id, 10);

    if (!quizId) {
      return NextResponse.json(
        { error: 'Invalid quiz_id.' },
        { status: 400 }
      );
    }

    // Quiz und verknüpfte Fragen abrufen
    const quiz = await db.quiz.findUnique({
      where: { quiz_id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found.' },
        { status: 404 }
      );
    }

    // Maximale Punktanzahl berechnen
    // reduce() reduziert ein Array auf einen einzelnen Wert
    // sum wird als 0 initialisiert und für jede Frage wird die Punktzahl addiert
    const maxPoints = quiz.questions.reduce((sum, question) => sum + (question.points ?? 0), 0);

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