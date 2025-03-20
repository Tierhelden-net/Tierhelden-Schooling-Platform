import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const QuizzesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const quizzes = await db.quiz.findMany({
    include: {
      questions: {
      },
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={quizzes} />
    </div>
  );
};

export default QuizzesPage;
