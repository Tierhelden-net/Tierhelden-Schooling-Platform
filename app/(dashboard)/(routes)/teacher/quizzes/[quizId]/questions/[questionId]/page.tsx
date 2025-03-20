import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Target,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { QuestionTitleForm } from "./_components/question-title-form";
import { QuestionDescriptionForm } from "./_components/question-description-form";
import { AnswerForm } from "./_components/answers-form";
import { QuestionActions } from "./_components/question-actions";
import { PointsForm } from "./_components/points-form";
import { QuestionAnswerMessageForm } from "./_components/question-answer-message-form copy";
import { QuestionKnockoutForm } from "./_components/question-knockout-form";
import { RandomAForm } from "./_components/randoma-form";

const QuestionIdPage = async (props: {
  params: Promise<{ quizId: string; questionId: string }>
}) => {
  const params = await props.params
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const question = await db.question.findUnique({
    where: {
      question_id: params.questionId,
    },
    include: {
      answers: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!question) {
    return redirect("/");
  }

  const requiredFields = [
    question.question_title,
    question.question_text,
    question.answers,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete =
    requiredFields.every(Boolean) || question.isPublished === true; //da default von isPublished "true"

  return (
    <>
      {!question.isPublished && (
        <Banner
          variant="warning"
          label="Diese Frage ist nicht veröffentlicht und wird im Quiz nicht angezeigt."
        />
      )}
      {question.correct_answers === 0 && (
        <Banner
          variant="warning"
          label="Deine Frage braucht mindestens 1 richtige Antwort."
        />
      )}
      {!!(!isComplete && question.isPublished) && (
        <Banner
          variant="warning"
          label="Diese Frage ist nicht vollständig und wird im Quiz aber angezeigt."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/quizzes/${params.quizId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Quiz
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Question Creation</h1>
                <span className="text-sm dark:text-slate-400 text-slate-700 ">
                  Vervollständige alle Felder {completionText}
                </span>
              </div>
              <QuestionActions
                disabled={!isComplete}
                quizId={params.quizId}
                questionsId={params.questionId}
                isPublished={question.isPublished ?? false}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your question</h2>
            </div>
            <QuestionTitleForm
              question_title={question.question_title ?? ""}
              quizId={params.quizId}
              questionId={params.questionId}
            />
            <QuestionDescriptionForm
              initialData={question}
              quizId={params.quizId}
              questionId={params.questionId}
            />
            <RandomAForm
              random_answers={question.random_answers ?? false}
              quizId={params.quizId}
              questionId={params.questionId}
            />
            <QuestionKnockoutForm
              initialData={question}
              quizId={params.quizId}
              questionId={params.questionId}
            />
          </div>
          {/*
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add visuals</h2>
            </div>
            <QuestionVideoForm
              initialData={question}
              questionId={params.questionId}
              quizId={params.quizId}
            />
          </div>
          */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Answers</h2>
            </div>
            <AnswerForm
              initialData={question}
              questionId={params.questionId}
              quizId={params.quizId}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Target} />
              <h2 className="text-xl">Punkte</h2>
            </div>
            <PointsForm
              initialData={question}
              quizId={params.quizId}
              questionId={params.questionId}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={MessageSquare} />
              <h2 className="text-xl">Add message for answers</h2>
            </div>
            <QuestionAnswerMessageForm
              initialData={question}
              questionId={params.questionId}
              quizId={params.quizId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionIdPage;
