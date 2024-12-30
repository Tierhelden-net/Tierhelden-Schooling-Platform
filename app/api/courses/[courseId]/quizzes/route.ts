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
