// GET: Einzelne Frage abrufen 
// PUT: Frage aktualisieren 
// DELETE: Frage löschen 

// app/api/quizzes/[quiz_id]/questions/[question_id]/route.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// GET: Einzelne Frage abrufen
export async function GET(req: Request, { params }: { params: { quiz_id: string; question_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id, question_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id || !question_id) {
        // TODO: Lieber einzeln abfragen, damit man leichter herausfinden kann, welcher Parameter fehlt?
      return new NextResponse("Missing Quiz ID or Question ID", { status: 400 });
    }

    const question = await db.question.findUnique({ // Find the question by question_id
      where: { question_id: parseInt(question_id) }, 
      include: { // Include the answers
        answers: true,
      },
    });

    if (!question) { // Check if the question was found
      return new NextResponse("Question not found", { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_QUESTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: Frage aktualisieren
export async function PUT(req: Request, { params }: { params: { quiz_id: string; question_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id, question_id } = params;
    const { question_text, question_type, answer_selection_type, correct_answers, points, is_knockout } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id || !question_id) {
        // TODO: Lieber einzeln abfragen? 
      return new NextResponse("Missing Quiz ID or Question ID", { status: 400 });
    }

    const question = await db.question.update({
      where: { question_id: parseInt(question_id) }, // Update the question by question_id
      data: {
        // TODO: Was soll hier geupdated werden? 
        question_text,
        question_type,
        answer_selection_type,
        correct_answers,
        points,
        is_knockout,
      },
    });

    return NextResponse.json(question);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_QUESTIONS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Frage löschen
export async function DELETE(req: Request, { params }: { params: { quiz_id: string; question_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id, question_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id || !question_id) {
        // TODO: Lieber einzeln abfragen?
      return new NextResponse("Missing Quiz ID or Question ID", { status: 400 });
    }

    await db.question.delete({ // Delete the question by question_id 
      where: { question_id: parseInt(question_id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_QUESTIONS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
