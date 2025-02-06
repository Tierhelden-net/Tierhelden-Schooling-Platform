import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; relationId: string } }
) {
  try {
    const { userId } = auth();

    const relationId = parseInt(params.relationId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Überprüfen, ob die courseId vorhanden ist
    if (!params.courseId || !params.relationId) {
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

    // QuizCourse Relation abrufen
    const relation = await db.courseQuiz.findUnique({
      where: { id: relationId },
    });
    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!relation) {
      return NextResponse.json(
        { error: "Quiz relation not found." },
        { status: 404 }
      );
    }

    const quizToCourse = await db.courseQuiz.delete({
      where: {
        id: relationId,
        course_id: params.courseId,
      },
    });

    return NextResponse.json(quizToCourse);
  } catch (error) {
    console.log("COURSE_ID_QUIZ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; relationId: string } }
) {
  try {
    const { userId } = auth();
    const { quizId } = await req.json();

    const relationId = parseInt(params.relationId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Überprüfen, ob die courseId vorhanden ist
    if (!params.courseId || !params.relationId) {
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

    // QuizCourse Relation abrufen
    const relation = await db.courseQuiz.findUnique({
      where: { id: relationId },
    });
    // Falls das Quiz nicht gefunden wird, wird eine Fehlermeldung zurückgegeben
    if (!relation) {
      return NextResponse.json(
        { error: "Quiz relation not found." },
        { status: 404 }
      );
    }

    const quizToCourse = await db.courseQuiz.update({
      where: {
        id: relationId,
      },
      data: {
        quiz_id: parseInt(quizId),
      },
    });

    return NextResponse.json(quizToCourse);
  } catch (error) {
    console.log("COURSE_ID_QUIZ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
