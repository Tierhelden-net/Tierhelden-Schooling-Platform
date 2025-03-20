//Result Page
//shows all Versuche of a quiz
//ausklappbar?
//Datum, Menge an Punkten, bestanden oder nicht

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

import { getQuiz } from "@/actions/get-quiz";
import { ResultCard } from "./_components/result-card";
import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";

const QuizResultPage = async (props: {
  params: Promise<{ courseId: string; quizId: string; quizAttemptId: string }>
}) => {
  const params = await props.params
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    quiz,
    course,
    //muxData,
    completedQuizAttempts,
  } = await getQuiz({
    userId,
    quizId: params.quizId,
    courseId: params.courseId,
  });

  if (!quiz || !course) {
    return redirect("/");
  }

  return (
    <div>
      <DataCard label={"Quiz Ergebnisse: " + quiz.quiz_name}>
        <p>
          Um zu bestehen brauchst du mindestens {quiz.passing_points} Punkte.
        </p>

        {
          //max attempts 2 for Tutorials
          //Knockout question?
          quiz.questions.filter((q) => q.is_knockout).length > 0 && (
            <p>
              <br />
              <span>
                {"Dieses Quiz beinhaltet " +
                  quiz.questions.filter((q) => q.is_knockout).length +
                  " Knockout Frage(n)."}
              </span>
              <br />
              <span>
                Wenn du eine dieser Fragen falsch beantwortest, hast du das Quiz
                nicht bestanden.
              </span>
            </p>
          )
        }
        {course.courseCategory?.category === "Tutorial" && (
          <p>
            {" "}
            <br />
            Für dieses Quiz hast noch {2 - completedQuizAttempts.length} von
            insgesamt 2 Versuchen.
          </p>
        )}
      </DataCard>
      <ResultCard quiz={quiz} completedQuizAttempts={completedQuizAttempts} />
    </div>
  );
};

export default QuizResultPage;
