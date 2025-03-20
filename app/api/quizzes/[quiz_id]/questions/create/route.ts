import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ quiz_id: string }> }
) {
  const params = await props.params
  try {
    const { userId } = await auth();

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

    const quiz_id = params.quiz_id;

    // Extrahiere den JSON-Body der Anfrage
    const body = await request.json();

    // Extrahiere quiz_name aus dem Body
    const { question_title } = body;

    //find last question
    const lastQuestion = await db.question.findFirst({
      where: {
        quiz_id: quiz_id,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastQuestion?.position ? lastQuestion.position + 1 : 0;

    const newQuestion = await db.question.create({
      data: {
        quiz_id: quiz_id,
        createdBy: userId,
        question_title: question_title,
        position: newPosition,
        correct_answers: 0,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz created successfully",
        question_title: newQuestion.question_title,
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quiz entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
