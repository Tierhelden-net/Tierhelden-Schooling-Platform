import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { Actions } from "./_components/actions";
import { ArrowLeft, PawPrint, UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { DataCard } from "../../analytics/_components/data-card";
import { UserroleForm } from "./_components/userrole-form";

const UserIdPage = async (props: { params: Promise<{ userId: string }> }) => {
  const params = await props.params
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  console.log(params.userId);

  const user = await db.user.findUnique({
    where: {
      user_id: params.userId,
    },
  });

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/users`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Userübersicht
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-center gap-x-4">
              <IconBadge icon={UserCircle2Icon} />
              <h1 className="text-2xl font-medium mt-2">{user.name}</h1>
            </div>
            <Actions
              userId={params.userId}
              user_role={user.user_role[0] ?? ""}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 ">
        <DataCard label={"Infos"}>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-active flex items-center gap-x-2">
              <IconBadge icon={PawPrint} size="sm" />
              {user.email}
            </li>
            <li className="text-sm text-active flex items-center gap-x-2">
              <IconBadge icon={PawPrint} size="sm" />
              dabei seit
              <span className="text-inactive">
                {user.createdAt.toLocaleDateString("de-DE")}
              </span>
            </li>
            <li className="text-sm text-active flex items-center gap-x-2">
              <IconBadge icon={PawPrint} size="sm" />
              zuletzt online:{" "}
              <span className="text-inactive">
                {user.last_signed_in?.toLocaleString("de-DE") ?? "-"}
              </span>
            </li>
            <li className="text-sm text-active flex items-center gap-x-2">
              <IconBadge icon={PawPrint} size="sm" />
              letzte Lektion abgeschlossen:{" "}
              <span className="text-inactive">
                {user.last_chapter_completed?.toLocaleString("de-DE") ?? "-"}
              </span>
            </li>
          </ul>
        </DataCard>
        <UserroleForm userId={params.userId} initialData={user} />
        <div className="md:col-span-2">
          <DataCard label={"Begonnene Kurse"}></DataCard>
        </div>
      </div>
    </div>
  );
};

export default UserIdPage;
