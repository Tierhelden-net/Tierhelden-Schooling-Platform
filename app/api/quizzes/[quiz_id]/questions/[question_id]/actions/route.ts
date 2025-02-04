import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { quiz_id: string; question_id: string } }
) {
  try {
    const { userId } = auth();

    // Falls der Benutzer nicht angemeldet ist, wird eine Fehlermeldung zurückgegeben
    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
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

    // question data aus dem Request Body extrahieren
    const { ...values } = await request.json();

    // Überprüfen, ob die Frage existiert
    const existingQuestion = await db.question.findUnique({
      where: { question_id: question_id },
    });

    // Falls die Frage nicht existiert, wird eine Fehlermeldung zurückgegeben
    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    //Falls Punkte geändert werden:
    if (values.points) {
      //berechne Punkteänderung im Quiz
      const newPoints = values.points - (existingQuestion.points || 0);

      const quiz = await db.quiz.findUnique({
        where: { quiz_id: quiz_id },
      });

      await db.quiz.update({
        where: {
          quiz_id: quiz_id,
        },
        data: { max_points: (quiz?.max_points || 0) + newPoints },
      });
    }

    // Aktualisierung der Daten
    const updatedQuestion = await db.question.update({
      where: { question_id: question_id, quiz_id: quiz_id },
      data: { ...values },
    });

    return NextResponse.json(
      {
        message: "Question text updated successfully",
        question: updatedQuestion,
      },
      { status: 200 }
    );
    // falls wir eine leere Antwort zurückgeben wollen, können wir auch einfach NextResponse.ok() verwenden
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
