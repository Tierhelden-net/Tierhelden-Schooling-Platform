//Game Page: renders questions + answers

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React from "react";

import { getQuiz } from "@/actions/get-quiz";

import QuestionComponent from "./_components/question";

const QuestionPage = async ({
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
    muxData,
    //quizAttemps + userAnswers
  } = await getQuiz({
    userId,
    quizId: params.quizId,
    courseId: params.courseId,
  });

  if (!quiz || !course) {
    return redirect("/");
  }

  let questions = quiz.questions;

  //shuffle questions
  if (quiz.random_questions) {
    questions = quiz.questions.sort(() => Math.random() - 0.5);
  }

  return (
    <QuestionComponent
      quiz={quiz}
      questions={questions}
      quizAttemptId={params.quizAttemptId}
      courseId={params.courseId}
    />
  );
};

export default QuestionPage;
