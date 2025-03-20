import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  props: { params: Promise<{ quiz_id: string }> }
) {
  const params = await props.params
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quizId = params.quiz_id;

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quizId) {
      return NextResponse.json(
        { error: "quiz_id is required in the URL" },
        { status: 400 }
      );
    }

    // Quiz abrufen
    const quiz = await db.quiz.findUnique({
      where: { quiz_id: quizId },
    });

    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const { list } = await req.json();

    for (let item of list) {
      await db.question.update({
        where: { question_id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
