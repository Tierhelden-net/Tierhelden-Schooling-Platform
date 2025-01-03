/* export const isTeacher = (userId?: string | null) => {
  return process.env.NEXT_PUBLIC_TEACHER_ID.includes(userId);
}; */

import { db } from "@/lib/db";
import { UserRole, User } from "@prisma/client";

export const isTeacher = async (userId?: string | null) => {
  try {
    if (!userId) {
      return false;
    }

    const user = await db.user.findUnique({
      // Find the unique user by userId
      where: {
        user_id: userId,
      },
    });

    // Check if the user is a teacher/admin
    if (!user || user.user_role !== UserRole.ADMIN) {
      // Return false if the user is not a teacher/admin
      return false;
    }

    // Return true if the user is a teacher/admin
    return !!(user.user_role === UserRole.ADMIN);
  } catch (error) {
    // Catch any errors
    console.log("[CHECK_IS_TEACHER_ERROR]", error);
    return false;
  }
};
