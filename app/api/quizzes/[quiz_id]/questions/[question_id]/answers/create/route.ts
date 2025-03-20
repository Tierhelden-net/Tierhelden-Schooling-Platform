import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importiere die Prisma-Instanz
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  const params = await props.params
  try {
    // userId aus Clerk-Authentifizierung
    const { userId } = await auth();

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
    if (!user || !user.user_role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quizId = params.quiz_id;
    const questionId = params.question_id;

    // Parse den Request-Body als JSON
    const body = await request.json();
    const { answer_text, is_correct } = body;

    // Validierung der Eingabedaten
    if (!answer_text || typeof is_correct !== "boolean") {
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
        answer_text: answer_text,
        is_correct: is_correct,
        quiz_id: quizId,
        position: newPosition,
      },
    });

    //correct answers in question
    if (is_correct) {
      await db.question.update({
        where: {
          question_id: questionId,
        },
        data: {
          correct_answers: question.correct_answers
            ? question.correct_answers + 1
            : 1,
        },
      });
    }
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
