import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: {
        user_id: params.userId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_ID_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
