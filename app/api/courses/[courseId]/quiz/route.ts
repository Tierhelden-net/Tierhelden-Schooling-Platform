import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string }> }
) {
  const params = await props.params
  try {
    const { userId } = await auth();
    const { quizId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Überprüfen, ob die courseId vorhanden ist
    if (!params.courseId) {
      return NextResponse.json(
        { error: "course id is required in the URL" },
        { status: 400 }
      );
    }

    // Course abrufen
    const course = await db.course.findUnique({
      where: { id: params.courseId },
    });

    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const quizToCourse = await db.courseQuiz.create({
      data: {
        quiz_id: quizId,
        course_id: params.courseId,
      },
    });

    return NextResponse.json(quizToCourse);
  } catch (error) {
    console.log("COURSE_ID_QUIZ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
