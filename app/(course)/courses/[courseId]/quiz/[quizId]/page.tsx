import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import React from "react";

import { getQuiz } from "@/actions/get-quiz";
import { Banner } from "@/components/banner";
import { StartQuizButtonComponent } from "./_components/start-quiz-button";

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

  //TODO: delete quiz attempts manually + that are older than 1 month ?

  const { quiz, course, notCompletedQuizAttempts, completedQuizAttempts } =
    await getQuiz({
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

        <StartQuizButtonComponent
          courseId={params.courseId}
          quizId={params.quizId}
        />
      </DataCard>
      {notCompletedQuizAttempts.length > 0 && (
        <div className="mt-4">
          <DataCard label={"Beende deinen letzten Versuch: "}>
            {notCompletedQuizAttempts.map((quizAttempt) => (
              <a
                href={`/courses/${params.courseId}/quiz/${params.quizId}/quizAttempt/${quizAttempt.quiz_attempt_id}`}
              >
                <p>{quizAttempt.attempt_at.toLocaleString("de-DE")}</p>
              </a>
            ))}
          </DataCard>
        </div>
      )}
      {completedQuizAttempts.length > 0 && (
        <div className="mt-4">
          <DataCard
            label={"deine Ergebnisse: "}
            url={`/courses/${params.courseId}/quiz/${params.quizId}/result`}
          ></DataCard>
        </div>
      )}
    </div>
  );
};

export default QuizIdPage;
