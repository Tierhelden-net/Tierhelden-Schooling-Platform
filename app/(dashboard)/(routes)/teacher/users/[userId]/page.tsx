import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { Actions } from "./_components/actions";

const UserIdPage = async ({ params }: { params: { someUserId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      user_id: params.someUserId,
    },
  });

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">{user.name}</h1>
          <span className="text-sm text-slate-700">
            dabei seit {user.createdAt.toLocaleDateString("de-DE")}
          </span>
        </div>
        <Actions userId={params.someUserId} user_role={user.user_role ?? ""} />
      </div>
    </div>
  );
};

export default UserIdPage;
