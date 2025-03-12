import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma-Instanz importieren
import { auth } from "@clerk/nextjs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { quiz_id: string; question_id: string } }
) {
  try {
    // Benutzer-Authentifizierung
    const { userId } = auth();

    // Falls der Benutzer nicht angemeldet ist, wird eine Fehlermeldung zurückgegeben
    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Benutzerrolle abrufen
    const user = await db.user.findUnique({
      where: { user_id: userId },
      select: { user_role: true },
    });

    // Falls der Benutzer kein Admin ist, wird eine Fehlermeldung zurückgegeben
    if (!user || !user.user_role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Extrahiere und parse IDs
    const quizId = params.quiz_id;
    const questionId = params.question_id;

    // Validierung der IDs
    if (!quizId || !questionId) {
      return NextResponse.json(
        { error: "Invalid quiz_id or question_id." },
        { status: 400 }
      );
    }

    // Datenbankabfrage der Frage
    const question = await db.question.findUnique({
      where: { question_id: questionId },
    });

    // Überprüfen, ob die Frage vorhanden ist und zum Quiz gehört
    if (!question || question.quiz_id !== quizId) {
      return NextResponse.json(
        {
          error: "Question not found or does not belong to the specified quiz.",
        },
        { status: 404 }
      );
    }

    // Alle Antworten zur Frage löschen
    await db.answer.deleteMany({
      where: { question_id: questionId },
    });

    // Frage löschen
    await db.question.delete({
      where: { question_id: questionId },
    });

    return NextResponse.json(
      { message: "Question deleted successfully." },
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
