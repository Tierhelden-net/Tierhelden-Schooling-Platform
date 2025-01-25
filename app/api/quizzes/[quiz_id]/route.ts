// GET: Einzelnes Quiz abrufen 
// PUT: Quiz aktualisieren 
// DELETE: Quiz löschen

// TODO: Wie wird die Quiz ID in der URL übergeben? String, Int?
// TODO: Welche Daten sollen aktualisiert werden?

// app/api/quizzes/[quiz_id]/route.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// GET: Einzelnes Quiz abrufen
export async function GET(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id) {
      return new NextResponse("Missing quizId", { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
    // TODO: Ist parseInt hier notwendig/richtig?
      where: { quiz_id: parseInt(quiz_id) }, // Find the quiz by quiz_id
      include: { // Include the questions and answers
        questions: { // Include the questions   
          include: { // Include the answers
            answers: true,
          },
        },
      },
    });

    if (!quiz) { // Check if the quiz was found
      return new NextResponse("Quiz not found", { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: Quiz aktualisieren
export async function PUT(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id } = params;
    // TODO: Hier die notwendigen Attribute hinzufügen? 
    const { quiz_name } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id) {
      return new NextResponse("Missing Quiz ID", { status: 400 });
    }

    const quiz = await db.quiz.update({ // Update the quiz
        // TODO: parseInt notwendig? Wie wird die Quiz ID als URL angezeigt? 
      where: { quiz_id: parseInt(quiz_id) }, // Find the quiz by quiz_id
      data: { // Update the quiz
        // TODO: Welche Daten sollen aktualisiert werden? 
        // TODO: Entsprechende Attribute hinzufügen
        quiz_name,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_PUT]", error); 
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Quiz löschen
export async function DELETE(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id) {
      return new NextResponse("Missing Quiz ID", { status: 400 });
    }

    await db.quiz.delete({
        // TODO: parseInt notwendig? 
      where: { quiz_id: parseInt(quiz_id) },
    });

    return new NextResponse(null, { status: 204 }); // Return a 204 status code
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_DELETE]", error); 
    return new NextResponse("Internal Error", { status: 500 });
  }
}
