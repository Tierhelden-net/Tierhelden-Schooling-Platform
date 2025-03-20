import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ quiz_id: string }> }
) {
  const params = await props.params
  try {
    // userId aus Clerk auth() extrahieren
    const { userId } = await auth();

    const quizId = params.quiz_id;

    if (!quizId) {
      return NextResponse.json(
        { error: "Invalid quiz ID. Must be a number." },
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
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    //alle Fragen des Quizzes finden
    const questions = await db.question.findMany({
      where: { quiz_id: quizId },
    });

    // Alle Antworten des Quiz löschen
    for (let item of questions) {
      await db.answer.deleteMany({
        where: { question_id: item.question_id },
      });
    }

    // Alle Fragen des Quiz löschen
    await db.question.deleteMany({
      where: { quiz_id: quizId },
    });

    // Quiz löschen
    await db.quiz.delete({
      where: { quiz_id: quizId },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
