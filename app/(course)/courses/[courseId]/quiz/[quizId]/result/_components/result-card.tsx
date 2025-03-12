"use client";

import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import { IconBadge } from "@/components/icon-badge";
import { CheckCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { Preview } from "@/components/preview";
import { cn } from "@/lib/utils";
import {
  Answer,
  Question,
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  quiz: Quiz & {
    questions: (Question & {
      answers: Answer[];
    })[];
  };
  completedQuizAttempts: (QuizAttempt & { userAnswers: UserAnswer[] })[];
}

export const ResultCard = ({
  completedQuizAttempts,
  quiz,
}: ResultCardProps) => {
  const [openCards, setOpenCards] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleCard = (quizAttemptId: string) => {
    setOpenCards((prev) => ({
      ...prev,
      [quizAttemptId]: !prev[quizAttemptId],
    }));
  };

  return (
    <div>
      {completedQuizAttempts.map((quizAttempt) => (
        <div className="m-4">
          <DataCard
            label={
              (quiz.quiz_name ?? "Quiz") +
              " vom " +
              new Date(quizAttempt.attempt_at).toLocaleString("de-DE")
            }
          >
            <div className="form-container">
              <div className="flex flex-row justify-around">
                <div className="w-1/3">
                  {quizAttempt.passed && (
                    <IconBadge icon={CheckCircle} variant={"success"} />
                  )}
                  {!quizAttempt.passed && <IconBadge icon={X} />}
                </div>
                <div className="ml-4 mb-2">
                  <p>
                    {quizAttempt.total_score + " / " + quiz.max_points} Punkten
                  </p>
                  <p>{quizAttempt.passed ? "Bestanden" : "Nicht bestanden"}</p>
                </div>
                <Button
                  onClick={() => toggleCard(quizAttempt.quiz_attempt_id)}
                  variant="secondary"
                >
                  {openCards[quizAttempt.quiz_attempt_id] ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </div>

              {quiz.questions.map((question) => (
                <div
                  className={cn(
                    "bg-slate-500/20 bg-opacity-30 rounded-2xl p-4 m-2 ",
                    openCards[quizAttempt.quiz_attempt_id] ? "block" : "hidden",
                    question.answers
                      .filter((answer) => answer.is_correct)
                      .map((answer) => answer.answer_id)
                      .every((answer_id) =>
                        quizAttempt.userAnswers
                          .filter(
                            (ua) => ua.question_id === question.question_id
                          )
                          .map((ua) => ua.answer_id)
                          .includes(answer_id)
                      ) &&
                      quizAttempt.userAnswers
                        .filter((ua) => ua.question_id === question.question_id)
                        .map((answer) => answer.answer_id)
                        .every((answer_id) =>
                          question.answers
                            .filter((correctAnswer) => correctAnswer.is_correct)
                            .map((ca) => ca.answer_id)
                            .includes(answer_id!)
                        ) &&
                      "bg-green-500/20",
                    question.answers
                      .filter((answer) => answer.is_correct)
                      .map((answer) => answer.answer_id)
                      .some(
                        (answer_id) =>
                          !quizAttempt.userAnswers
                            .filter(
                              (ua) => ua.question_id === question.question_id
                            )
                            .map((ua) => ua.answer_id)
                            .includes(answer_id)
                      ) &&
                      quizAttempt.userAnswers
                        .filter((ua) => ua.question_id === question.question_id)
                        .map((answer) => answer.answer_id)
                        .some((answer_id) =>
                          question.answers
                            .filter(
                              (correctAnswer) => !correctAnswer.is_correct
                            )
                            .map((ca) => ca.answer_id)
                            .includes(answer_id!)
                        ) &&
                      "bg-red-500/20"
                  )}
                  key={question.question_id}
                >
                  <h3>{question.question_title}</h3>
                  <Preview value={question.question_text!} />
                  <Separator className="bg-background" />
                  {question.answers.map((answer) => (
                    <div
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 p-4 m-2"
                      key={answer.answer_id}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 bg-muted-foreground mt-1 rounded-sm",
                          quizAttempt.userAnswers
                            .map((ua) => ua.answer_id)
                            .includes(answer.answer_id) &&
                            "bg-orange-400 before:content-['x'] before:text-foreground before:text-xl before:absolute before:translate-x-1/4 before:-translate-y-1/4"
                        )}
                      ></div>

                      <p>{answer.answer_text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      ))}
    </div>
  );
};
