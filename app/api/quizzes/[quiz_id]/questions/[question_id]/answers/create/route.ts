import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importiere die Prisma-Instanz
import { auth } from "@clerk/nextjs";

export async function POST(
  request: NextRequest,
  context: { params: { quiz_id: string; question_id: string } }
) {
  try {
    // userId aus Clerk-Authentifizierung
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Extrahiere die quiz_id und question_id aus den Parametern
    const { quiz_id: rawQuizId, question_id: rawQuestionId } = context.params;
    // Parse die quiz_id und question_id als Integer
    const quizId = parseInt(rawQuizId, 10);
    const questionId = parseInt(rawQuestionId, 10);

    // Parse den Request-Body als JSON
    const body = await request.json();
    const { answerText, isCorrect } = body;

    // Validierung der Eingabedaten
    if (!answerText || typeof isCorrect !== "boolean") {
      return NextResponse.json(
        { error: 'Invalid input. "text" and "isCorrect" are required.' },
        { status: 400 }
      );
    }

    // Datenbankabfrage der Frage
    const question = await db.question.findUnique({
      where: {
        question_id: questionId,
      },
      include: {
        quiz: true,
      },
    });

    // Überprüfen, ob die Frage existiert und zum Quiz gehört
    if (!question || question.quiz_id !== quizId) {
      return NextResponse.json(
        { error: "Quiz or question not found." },
        { status: 404 }
      );
    }

    //find last answer
    const lastAnswer = await db.answer.findFirst({
      where: {
        quiz_id: quizId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastAnswer?.position ? lastAnswer.position + 1 : 1;

    // Antwort erstellen
    const answer = await db.answer.create({
      data: {
        createdBy: userId,
        question_id: questionId,
        answer_text: answerText,
        is_correct: isCorrect,
        quiz_id: quizId,
        position: newPosition,
      },
    });

    // Erfolgreiche Antwort zurückgeben
    return NextResponse.json(
      { message: "Answer created successfully.", answer },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
