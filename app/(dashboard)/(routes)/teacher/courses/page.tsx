import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    console.log("No user found ("+userId+"), redirect from teacher/courses to /")
    return redirect("/");
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return ( 
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
   );
}
 
export default CoursesPage;
