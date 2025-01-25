import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { auth } from "@clerk/nextjs";

export async function DELETE(request: NextRequest, { params }: { params: { quiz_id: string } } ) {
  try {
    // userId aus Clerk auth() extrahieren
    const { userId } = auth();

    // Falls der Benutzer nicht angemeldet ist, wird eine Fehlermeldung zurückgegeben
    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Datenbankabfrage des Benutzers
    const user = await db.user.findUnique({
        where: { user_id: userId },
        select: { user_role: true },
        });

    // Falls der User kein Admin ist, wird eine Fehlermeldung zurückgegeben
    if (!user || user.user_role !== "ADMIN") {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
        );
    }

    const quizId = parseInt(params.quiz_id, 10);

    if (!quizId) {
      return NextResponse.json(
        { error: 'Invalid quiz ID. Must be a number.' },
        { status: 400 }
      );
    }

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quizId) {
        return NextResponse.json(
          { error: "quiz_id is required in the URL" },
          { status: 400 }
        );
      }

    const quiz = await db.quiz.findUnique({
        where: { quiz_id: quizId },
        });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found.' },
        { status: 404 }
      );
    }

    // Alle Antworten des Quiz löschen 
    await db.answer.deleteMany({
        where: { quiz_id: quizId },
      });

    // Alle Fragen des Quiz löschen
    await db.question.deleteMany({
        where: { quiz_id: quizId },
      });


    // Quiz löschen
    await db.quiz.delete({
      where: { quiz_id: quizId },
    });

    return NextResponse.json(
      { message: 'Quiz deleted successfully.' },
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