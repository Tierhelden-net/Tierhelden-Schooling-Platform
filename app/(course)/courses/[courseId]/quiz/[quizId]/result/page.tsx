//Result Page
//shows all Versuche of a quiz
//ausklappbar?
//Datum, Menge an Punkten, bestanden oder nicht

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React from "react";

import { getQuiz } from "@/actions/get-quiz";

const QuizResultPage = async ({
  params,
}: {
  params: { courseId: string; quizId: string; quizAttemptId: string };
}) => {
  const { userId } = auth();

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

  return <p>Well done.</p>;
};

export default QuizResultPage;
