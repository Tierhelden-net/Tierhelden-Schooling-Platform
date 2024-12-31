// POST: Quiz starten

// app/api/quizzes/[quiz_id]/start/route.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) { // Überprüfe, ob der Benutzer angemeldet ist
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { quiz_id } = params; // Hole die quiz_id aus den Parametern

    if (!quiz_id) { // Überprüfe, ob die quiz_id vorhanden ist
      return new NextResponse("Missing quizId", { status: 400 });
    }

    // Überprüfe, ob das Quiz existiert
    const quiz = await db.quiz.findUnique({
      where: { quiz_id: parseInt(quiz_id) },
    });

    if (!quiz) { // Überprüfe, ob das Quiz gefunden wurde
      return new NextResponse("Quiz not found", { status: 404 }); // Wenn nicht, gebe 404 zurück
    }

    // Erstelle einen neuen QuizAttempt
    const quizAttempt = await db.quizAttempt.create({
      data: { // Fülle die Daten des QuizAttempts
        user_id: userId,
        quiz_id: parseInt(quiz_id),
        total_score: 0, // Initialwert, wird später aktualisiert
        passed: false,  // Initialwert, wird später aktualisiert
      },
    });

    return NextResponse.json(quizAttempt);
  } catch (error) { // Fangen Sie alle Fehler ab
    console.log("[QUIZ_START]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
