// GET: Einzelne Antwort abrufen 
// PUT: Antwort aktualisieren 
// DELETE: Antwort löschen 

// app/api/questions/[questionId]/answers/[answerId]/route.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// GET: Einzelne Antwort abrufen
export async function GET(req: Request, { params }: { params: { question_id: string; answer_id: string } }) {
  try {
    const { userId } = auth();
    const { question_id, answer_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question_id || !answer_id) {
        // TODO: Lieber einzeln abfragen?
      return new NextResponse("Missing Question ID or Answer ID", { status: 400 });
    }

    // TODO: Ist das so korrekt? Sollte man vielleicht lieber die Frage abfragen und dann die Antwort?
    const answer = await db.answer.findUnique({ // Find the answer by answer_id
      where: { answer_id: parseInt(answer_id) },
    });

    if (!answer) { // Check if the answer was found
      return new NextResponse("Answer not found", { status: 404 });
    }

    return NextResponse.json(answer);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_ANSWERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: Antwort aktualisieren
export async function PUT(req: Request, { params }: { params: { question_id: string; answer_id: string } }) {
  try {
    const { userId } = auth();
    const { question_id, answer_id } = params;
    const { answer_text, is_correct, position } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question_id || !answer_id) {
        // TODO: Lieber einzeln? 
      return new NextResponse("Missing Question ID or Answer ID", { status: 400 });
    }

    const answer = await db.answer.update({ // Update the answer
      where: { answer_id: parseInt(answer_id) },
      data: { // Update the answer data
        answer_text,
        is_correct,
        position,
      },
    });

    return NextResponse.json(answer);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_ANSWERS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Antwort löschen
export async function DELETE(req: Request, { params }: { params: { question_id: string; answer_id: string } }) {
  try {
    const { userId } = auth();
    const { question_id, answer_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question_id || !answer_id) {
        // TODO: Lieber einzeln abfragen? 
      return new NextResponse("Missing Question ID or Answer ID", { status: 400 });
    }

    await db.answer.delete({ // Delete the answer
      where: { answer_id: parseInt(answer_id) }, // Find the answer by answer_id
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_ANSWERS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
