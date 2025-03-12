import { db } from "@/lib/db";

export const getisTeacher = async (userId: string): Promise<boolean> => {
  try {
    const user_id = userId;
    let isAdmin = false;

    const user = await db.user.findUnique({
      where: {
        user_id: user_id,
      },
      select: {
        user_role: true,
      },
    });

    if (!user) {
      return (isAdmin = false);
    }

    if (user.user_role?.includes("ADMIN")) {
      isAdmin = true;
    }
    return isAdmin;
  } catch (error) {
    console.log("[GET_TEACHER]", error);
    return false;
  }
};
