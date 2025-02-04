import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { quiz_id: string; question_id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quiz_id = parseInt(params.quiz_id);
    const question_id = parseInt(params.question_id);

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quiz_id || !question_id) {
      return NextResponse.json(
        { error: "quiz id or question id is required in the URL" },
        { status: 400 }
      );
    }

    // Überprüfen, ob die Frage existiert
    const existingQuestion = await db.question.findUnique({
      where: { question_id: question_id },
      include: {
        answers: true,
      },
    });

    // Falls die Frage nicht existiert, wird eine Fehlermeldung zurückgegeben
    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const unpublishedQuestion = await db.question.update({
      where: {
        question_id: question_id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedQuestion);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
