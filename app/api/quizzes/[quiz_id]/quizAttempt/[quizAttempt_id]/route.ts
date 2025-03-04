import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { quiz_id: string; quizAttempt_id: string } }
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
    const quizAttempt_id = params.quizAttempt_id;

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quiz_id || !quizAttempt_id) {
      return NextResponse.json(
        { error: "quiz id and quiz attempt id is required in the URL" },
        { status: 400 }
      );
    }

    // QuizAttempt abrufen
    const quizAttempt = await db.quizAttempt.findUnique({
      where: { quiz_attempt_id: quizAttempt_id },
    });

    // Falls QuizAttempt nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!quizAttempt) {
      return NextResponse.json(
        { error: "Quiz Attempt not found." },
        { status: 404 }
      );
    }

    //calculate quiz results:
    let totalpoints = 0;
    let passed = false;
    let passedKnockout = true;

    const quiz = await db.quiz.findUnique({
      where: { quiz_id: quiz_id },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }
    const questions = await db.question.findMany({
      where: { quiz_id: quiz_id },
      include: {
        answers: true,
      },
    });

    const userAnswers = await db.userAnswer.findMany({
      where: { quiz_attempt_id: quizAttempt_id, user_id: userId },
    });

    for (let question of questions) {
      let correctAnswers = question.answers.filter(
        (answer) => answer.is_correct
      );
      let userAnswer = userAnswers
        .filter((userAnswer) => userAnswer.question_id === question.question_id)
        .map((userAnswer) => userAnswer.answer_id);
      let correct = true;
      for (let answer of correctAnswers) {
        if (!userAnswer.includes(answer.answer_id)) {
          correct = false;
          break;
        }
      }
      if (correct) {
        totalpoints = totalpoints + (question.points ?? 0);
      }
      //if knockout question is answered wrong, the quiz is failed
      else if (!correct && question.is_knockout) {
        passedKnockout = false;
      }
    }

    quiz.passing_points
      ? (passed = totalpoints >= quiz.passing_points)
      : (passed = true);

    if (!passedKnockout) {
      passed = false;
    }

    // QuizAttempt aktualisieren
    const updatedQuizAttempt = await db.quizAttempt.update({
      where: { quiz_attempt_id: quizAttempt_id },
      data: { total_score: totalpoints, passed: passed },
    });

    //update last_chapter_completed for the user
    if (passed) {
      await db.user.update({
        where: {
          user_id: userId,
        },
        data: {
          last_chapter_completed: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        message: "Quiz Attempt completed successfully.",
        quizAttempt: updatedQuizAttempt,
      },
      { status: 200 }
    );
    // falls wir eine leere Antwort zurückgeben wollen, können wir auch einfach NextResponse.ok() verwenden
  } catch (error) {
    console.error("Error updating quiz attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
