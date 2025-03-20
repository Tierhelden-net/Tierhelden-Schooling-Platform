import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  props: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  const params = await props.params
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // quiz_id aus den Parametern als Integer extrahieren (wird als String übergeben)
    const quiz_id = parseInt(params.quiz_id);
    const question_id = parseInt(params.question_id);

    // Überprüfen, ob die quiz_id vorhanden ist
    if (!quiz_id || !question_id) {
      return NextResponse.json(
        { error: "quiz id or questions id is required in the URL" },
        { status: 400 }
      );
    }

    const { list } = await req.json();
    console.log(list);

    for (let item of list) {
      await db.answer.update({
        where: { answer_id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
