// POST: Create a new quiz for a course
// GET: Get ALL quizzes for a course 

// Offene Frage: Sollten hier tatsächlich ALLE Quizzes für einen Kurs abgerufen werden?
// Genügt es nach der course_id zu filtern oder brauchen wir weitere Filter?
// Ist es egal, wie course_id benannt ist? Wenn nein, muss es
// course_id oder courseId sein? Wäre es sinnvoll, die Benennung in der 
// Datenbank zu ändern? 

import { auth } from "@clerk/nextjs"; 
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request, { params }: { params: { course_id: string } }) { 
  try {
    const { userId } = auth(); // Get the userId from the auth() function (Clerk)
    const { quiz_name } = await req.json();  // Get the quiz_name from the request body
    const { course_id } = params; // Get the course_id from the URL

    if (!userId || !isTeacher(userId)) { // Check if the user is a teacher
      return new NextResponse("Unauthorized", { status: 401 }); // Return an error if the user is not a teacher
    }

    if (!course_id) {
      return new NextResponse("Missing course_id", { status: 400 }); // Return an error if the course_id is missing
    }

    const quiz = await db.quiz.create({ // Create a new quiz
      data: {
        userId, // This is the userId that we get from the auth() function (Clerk)
        quiz_name, // This is the quiz_name that we get from the request body (req.json())
        course_id, // This is the course_id that we get from the URL
      },
    });

    return NextResponse.json(quiz); // Return the created quiz
  } catch (error) { // Catch any errors
    console.log("[QUIZ]", error); 
    return new NextResponse("Internal Error", { status: 500 }); // return an error if something goes wrong
  }
}

export async function GET(req: Request, { params }: { params: { course_id: string } }) {
  try {
    const { userId } = auth();
    const { course_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!course_id) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    const quizzes = await db.quiz.findMany({ // Find all quizzes for a course
      where: {
        course_id: course_id, // Filter by course_id
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.log("[QUIZZES_GET_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
