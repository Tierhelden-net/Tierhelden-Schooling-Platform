import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import React from "react";

import { getQuiz } from "@/actions/get-quiz";
import { Banner } from "@/components/banner";
import { StartQuizButtonComponent } from "./_components/start-quiz-button";
import { UserAnswer } from "@prisma/client";

const QuizIdPage = async (props: {
  params: Promise<{ courseId: string; quizId: string }>
}) => {
  const params = await props.params
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

  //if Tutorial more than twice failed, lock it
  let failed = false;
  const isTutorial = course.courseCategory?.category === "Tutorial";
  if (isTutorial && completedQuizAttempts.length > 2) {
    failed = true;
  }

  //count answered questions in unfinished quiz attempts
  const countUnfinishedQuestions = (userAnswers: UserAnswer[]) => {
    let count = 0;
    let answeredQuestions = userAnswers?.map((answer) => answer.question_id);
    quiz.questions.forEach((question) => {
      if (!answeredQuestions?.includes(question.question_id)) {
        count++;
      }
    });
    return count + " / " + quiz.questions.length;
  };

  return (
    <div>
      {failed && (
        <Banner
          variant="warning"
          label="Du hast die Grundschulung leider nicht bestanden und leider keine Versuche mehr übrig."
        />
      )}
      {!failed && isTutorial && completedQuizAttempts.length < 1 && (
        <Banner
          variant="success"
          label="Willkommen zu deinem ersten Quiz. Für die Grundschulung hast du maximal 2 Versuche."
        />
      )}
      {!failed && isTutorial && completedQuizAttempts.length === 1 && (
        <Banner
          variant="success"
          label="Für die Grundschulung hast du noch 1 Versuch."
        />
      )}
      {!failed &&
        completedQuizAttempts.some(
          (attempt) => quiz.quiz_id === attempt.quiz_id && attempt.passed
        ) && (
          <Banner
            variant="success"
            label="Herzlichen Glückwunsch! Du hast das Quiz bestanden."
          />
        )}
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
            isLocked={failed || completedQuizAttempts.length > 1}
          />
        </DataCard>
        {notCompletedQuizAttempts.length > 0 && !failed && (
          <div className="mt-4">
            <DataCard label={"Beende deinen letzten Versuch: "}>
              <div className="flex justify-between pt-2">
                <a
                  className="hover:underline "
                  href={`/courses/${params.courseId}/quiz/${params.quizId}/quizAttempt/${notCompletedQuizAttempts[0].quiz_attempt_id}`}
                >
                  <p>
                    {notCompletedQuizAttempts[0].attempt_at.toLocaleString(
                      "de-DE"
                    )}
                  </p>
                </a>
                <div className="text-sm text-gray-400">
                  {" noch " +
                    countUnfinishedQuestions(
                      notCompletedQuizAttempts[0].userAnswers
                    ) +
                    " Fragen"}
                  {
                    // <Trash className="h-4 w-4 inline-block ml-2 mb-1" onClick={deleteAttempt(quizAttempt.quiz_attempt_id)} />
                  }
                </div>
              </div>
            </DataCard>
          </div>
        )}
        {completedQuizAttempts.length > 0 && (
          <div className="mt-4">
            <DataCard
              label={"deine Ergebnisse: "}
              url={`/courses/${params.courseId}/quiz/${params.quizId}/result`}
            >
              <div className="flex justify-between pt-2">
                <p>
                  {completedQuizAttempts[0].total_score +
                    " / " +
                    quiz.max_points +
                    " Punkten"}
                </p>

                <div className="text-sm text-gray-400">
                  {completedQuizAttempts[0].passed
                    ? "Bestanden"
                    : "Nicht bestanden"}
                </div>
              </div>
            </DataCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizIdPage;
