import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importiere die Prisma-Instanz
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { quiz_id: string; question_id: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quizId = parseInt(params.quiz_id);
    const questionId = parseInt(params.question_id);

    // Datenbankabfrage der Answer
    const answer = await db.answer.findUnique({
      where: {
        answer_id: values.answer_id,
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

    //changed is_correct?
    if (answer.is_correct != values.is_correct) {
      let correctAnswers = answer.question.correct_answers ?? 0;

      if (values.is_correct === true) {
        correctAnswers += 1;
      } else if (values.is_correct === false) {
        correctAnswers -= 1;
      }

      //correct answers in question
      await db.question.update({
        where: {
          question_id: questionId,
        },
        data: {
          correct_answers: correctAnswers,
        },
      });
    }

    const updatesAnswer = await db.answer.update({
      where: {
        answer_id: values.answer_id,
        question_id: questionId,
        quiz_id: quizId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatesAnswer);
  } catch (error) {
    console.log("Error updating answer", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
