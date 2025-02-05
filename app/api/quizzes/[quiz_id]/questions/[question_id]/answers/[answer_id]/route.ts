import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importiere die Prisma-Instanz
import { auth } from "@clerk/nextjs";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { quiz_id: string; question_id: string; answer_id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extrahiere und parse IDs
    const quizId = parseInt(params.quiz_id, 10);
    const questionId = parseInt(params.question_id, 10);
    const answerId = parseInt(params.answer_id, 10);

    // Validierung der IDs
    if (!quizId || !questionId) {
      return NextResponse.json(
        { error: "Invalid quiz_id or question_id." },
        { status: 400 }
      );
    }

    // Datenbankabfrage der Frage
    const answer = await db.answer.findUnique({
      where: {
        answer_id: answerId,
      },
      include: {
        quiz: true,
        question: true,
      },
    });

    // Überprüfen, ob die Antwort existiert und zum Quiz/Frage gehört
    if (
      !answer ||
      answer.quiz_id !== quizId ||
      answer.question_id !== questionId
    ) {
      return NextResponse.json(
        { error: "Quiz or question or answer not found." },
        { status: 404 }
      );
    }

    const deletedAnswer = await db.answer.delete({
      where: {
        answer_id: answerId,
      },
    });

    return NextResponse.json(deletedAnswer);
  } catch (error) {
    console.log("[ANSWER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
