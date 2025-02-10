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

const QuizIdPage = async ({
  params,
}: {
  params: { courseId: string; quizId: string };
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

  /*
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
*/
  return (
    <div className="p-6">
      <DataCard label="Quiz">
        <QuizComponent quiz={quiz} />
      </DataCard>
    </div>
  );
};

export default QuizIdPage;
