import { getisTeacher } from "@/actions/get-isTeacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const isAdmin = await getisTeacher(userId);
  if (!isAdmin) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
