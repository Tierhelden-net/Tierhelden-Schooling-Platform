import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { QuestionTitleForm } from "./_components/question-title-form";
import { QuestionDescriptionForm } from "./_components/question-description-form";
import { QuestionAccessForm } from "./_components/question-access-form";
import { QuestionVideoForm } from "./_components/question-video-form";
import { QuestionActions } from "./_components/question-actions";
import { Description } from "@radix-ui/react-dialog";

const QuestionIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  /*
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });
  */
  const question = {
    question_id: "3",
    isPublished: true,
    title: "testfrage",
    description: "xxx",
    videoUrl: "",
  };

  if (!question) {
    return redirect("/");
  }

  const requiredFields = [
    question.title,
    question.description,
    question.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!question.isPublished && (
        <Banner
          variant="warning"
          label="Dieses Kapitel ist nicht veröffentlicht. Es wird nicht für deine Mitarbeiter angezeigt."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Kurs
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Vervollständige alle Felder {completionText}
                </span>
              </div>
              <QuestionActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={question.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <QuestionTitleForm
                initialData={question}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <QuestionDescriptionForm
                initialData={question}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <QuestionAccessForm
                initialData={question}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <QuestionVideoForm
              initialData={question}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionIdPage;
