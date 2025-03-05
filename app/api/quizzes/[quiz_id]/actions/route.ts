import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { quiz_id: string } }
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
    const quiz_id = params.quiz_id;

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quiz_id) {
      return NextResponse.json(
        { error: "quiz id is required in the URL" },
        { status: 400 }
      );
    }

    // question data aus dem Request Body extrahieren
    const { ...values } = await request.json();

    // Quiz abrufen
    const quiz = await db.quiz.findUnique({
      where: { quiz_id: quiz_id },
    });

    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    // Quiz aktualisieren
    const updatedQuiz = await db.quiz.update({
      where: { quiz_id: quiz_id },
      data: { ...values },
    });

    return NextResponse.json(
      {
        message: "Quiz text updated successfully",
        quiz: updatedQuiz,
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
