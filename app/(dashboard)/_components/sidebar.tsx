import { auth } from "@clerk/nextjs/server";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const Sidebar = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const user = await db.user.findUnique({
    where: {
      user_id: userId,
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes user={user} />
      </div>
    </div>
  );
};
