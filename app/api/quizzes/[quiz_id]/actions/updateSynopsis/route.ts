import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 
import { auth } from "@clerk/nextjs";

export async function PATCH(request: NextRequest, { params }: { params: { quiz_id: string } }) {
  try {
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
    
    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quizId = parseInt(params.quiz_id, 10);

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quizId) {
      return NextResponse.json(
        { error: "quiz_id is required in the URL" },
        { status: 400 }
      );
    }

    // quizTitle aus dem Request Body extrahieren
    const { quizSynopsis } = await request.json();

    // Überprüfen, ob quizTitle vorhanden ist
    if (!quizSynopsis) {
      return NextResponse.json(
        { error: "quizTitle is required" },
        { status: 400 }
      );
    }

    // Überprüfen, ob das Quiz existiert 
    const existingQuiz = await db.quiz.findUnique({
      where: { quiz_id: quizId },
    });

    // Falls das Quiz nicht existiert, wird eine Fehlermeldung zurückgegeben
    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Aktualisierung des quiz_title
    const updatedQuiz = await db.quiz.update({
      where: { quiz_id: quizId },
      data: { quiz_synopsis: quizSynopsis },
    });

    return NextResponse.json(
      { message: "Quiz title updated successfully", quiz: updatedQuiz },
      { status: 200 }
    );
    // falls wir eine leere Antwort zurückgeben wollen, können wir auch einfach NextResponse.ok() verwenden
  } catch (error) {
    console.error("Error updating quiz title:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}