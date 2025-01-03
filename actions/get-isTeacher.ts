import { db } from "@/lib/db";
import { users } from "@prisma/client";

export const getTeacherIds = (async) => {
  const teacher = await db.users.findMany({
    where: { userRole: "ADMIN" },
    select: { userId: true },
  });
  return teacher.map((user) => user.userId);
};
