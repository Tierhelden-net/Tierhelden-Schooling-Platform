import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  Target,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { CategoryForm } from "./_components/category-form";
import { PointsForm } from "./_components/points-form";
import { QuestionsForm } from "./_components/questions-form";
import { Actions } from "./_components/actions";

const QuizIdPage = async ({ params }: { params: { quizId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  
  const quiz = await db.quiz.findUnique({
    where: {
      quiz_id: parseInt(params.quizId),
    },
    include: {
      questions: {
      },
    },
  });
  
  /*const quiz = {
    quiz_id: 3,
    quiz_name: "Test-Quiz",
    title: "Test Quiz", //we need that!
    createdAt: new Date("2024-12-29 22:59:12"),
    updatedAt: new Date("2024-12-29 22:59:13"),
    quiz_synopsis: "Dies ist lediglich ein Test. ",
    max_points: 1,
    passing_points: 0,
    assigned_to_course: false,
    course_id: "",
    questions: [
      {
        question_id: "3",
        question_text: "Frage 1",
        question_type: "",
        is_knockout: true,
      },
    ],
  };*/

  /*
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  */

  const categories = [
    {
      id: "1",
      name: "course quiz",
    },
    {
      id: "2",
      name: "test quiz",
    },
    {
      id: "3",
      name: "rang quiz",
    },
  ];

  if (!quiz) {
    return redirect("/");
  }

  const requiredFields = [
    quiz.quiz_name,
    quiz.quiz_synopsis,
    //quiz.questions.some((question) => question.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  // vorerst auf false gesetzt, da wir dieses Feld noch nicht in der Datenbank haben
  const assigned_to_course = false;

  // assigned_to_course muss wieder zu quiz.assigned_to_course geändert werden, 
  // wir haben dieses Feld nur noch nicht in der Datenbank
  return (
    <>
      {!assigned_to_course && (
        <Banner label="Dieses Quiz ist nirgends veröffentlicht! Deine Mitarbeiter können dieses Quiz nicht finden." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Quiz erstellen</h1>
            <span className="text-sm text-slate-700">
              Vervollständige alle Felder {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            quizId={params.quizId}
            assigned_to_course={assigned_to_course}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Quiz anpassen</h2>
            </div>
            <TitleForm initialData={quiz} quizId={quiz.quiz_id} />
            <DescriptionForm initialData={quiz} quizId={quiz.quiz_id} />
            <CategoryForm
              initialData={quiz}
              quizId={quiz.quiz_id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Fragen</h2>
              </div>
              <QuestionsForm initialData={quiz} quizId={quiz.quiz_id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Target} />
                <h2 className="text-xl">Punkte</h2>
              </div>
              <PointsForm initialData={quiz} quizId={quiz.quiz_id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizIdPage;
