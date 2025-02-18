import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import Quiz from "react-quiz-component";
import React from "react";

import { getQuiz } from "@/actions/get-quiz";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { QuizComponent } from "./_components/quiz";
import { Button } from "@/components/ui/button";

const QuizIdPage = async ({
  params,
}: {
  params: { courseId: string; quizId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  //Start-Page Quiz

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

  return (
    <div className="p-6">
      <DataCard label={quiz.quiz_name ?? "Quiz"}>
        <div className="flex justify-between">
          <div className="m-4">
            {quiz.quiz_synopsis}
            <p className="text-sm text-gray-500">
              Du brauchst mindestens {quiz.passing_points} Punkte von maximal{" "}
              {quiz.max_points} Punkten.
            </p>
          </div>
          <p className="justify-self-end">{quiz.questions.length} Fragen</p>
        </div>

        <a href={`/courses/${params.courseId}/quiz/${params.quizId}/question/`}>
          <Button>Start Quiz</Button>
        </a>
        {
          //<QuizComponent quiz={quiz} />
        }
      </DataCard>
    </div>
  );
};

export default QuizIdPage;
