import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const UsersPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  /* function to check if users are in sync
  *disabled for now, because user gets added when they sign up
  
  const clerkUsers = await clerkClient.users.getUserList({ limit: 1000 });
  let usersInSync = true;
  if (
    !clerkUsers.every((clerkUser) =>
      users.find((user) => clerkUser.id === user.user_id)
    )
  ) {
    usersInSync = false;
    console.log("Users are not in sync");
  }
*/
  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
      {
        // !usersInSync && (<UpdateButtonComponent users={users} clerkUsers={clerkUsers} />)
      }
    </div>
  );
};

export default UsersPage;
