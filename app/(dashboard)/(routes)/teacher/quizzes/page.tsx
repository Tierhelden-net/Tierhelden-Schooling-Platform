import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const QuizzesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  /* const quizzes = await db.quiz.findMany({
    where: {
      quiz_name,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  */

  const quizzes = await db.quiz.findMany({
    include: {
      questions: {
      },
    },
  });

  /* const quizzes = [
    {
      quiz_id: 3,
      quiz_name: "Test-Quiz",
      createdAt: new Date("2024-12-29 22:59:12"),
      updatedAt: new Date("2024-12-29 22:59:13"),
      quiz_synopsis: "Dies ist lediglich ein Test. ",
      max_points: 1,
      passing_points: 1,
    },
  ]; */

  return (
    <div className="p-6">
      <DataTable columns={columns} data={quizzes} />
    </div>
  );
};

export default QuizzesPage;
