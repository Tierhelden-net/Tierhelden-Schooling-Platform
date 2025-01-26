import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Target,
  Video,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { QuestionTitleForm } from "./_components/question-title-form";
import { QuestionDescriptionForm } from "./_components/question-description-form";
import { AnswerForm } from "./_components/answers-form";
import { QuestionVideoForm } from "./_components/question-video-form";
import { QuestionActions } from "./_components/question-actions";
import { Description } from "@radix-ui/react-dialog";
import { PointsForm } from "./_components/points-form";
import { QuestionAnswerMessageForm } from "./_components/question-answer-message-form copy";

const QuestionIdPage = async ({
  params,
}: {
  params: { quizId: string; questionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const question = await db.question.findUnique({
    where: {
      question_id: parseInt(params.questionId),
    },
    include: {
      answers: true,
    },
  });

  /*const question = {
    question_id: "3",
    title: "testfrage",
    question_text: "Frage 1",
    question_type: "",
    is_knockout: true,
    isPublished: true,
    videoUrl: "",
    question_pic: "",
    answers: [
      {
        answer_id: 1,
        answer_text: "yes",
        answer_pic: "",
        is_correct: true,
        position: null,
      },
      {
        answer_id: 2,
        answer_text: "no",
        answer_pic: "",
        is_correct: false,
        position: null,
      },
    ],
  };*/

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
                isPublished={question.isPublished}
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
              initialData={question}
              quizId={params.quizId}
              questionId={params.questionId}
            />
            <QuestionDescriptionForm
              initialData={question}
              quizId={params.quizId}
              questionId={params.questionId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <QuestionVideoForm
              initialData={question}
              questionId={params.questionId}
              quizId={params.quizId}
            />
          </div>
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

          <div className="md:col-span-2">
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
