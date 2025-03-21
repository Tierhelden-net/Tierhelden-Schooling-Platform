import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ courseId: string; relationId: string }> }
) {
  const params = await props.params
  try {
    const { userId } = await auth();

    const relationId = params.relationId;

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
  props: { params: Promise<{ courseId: string; relationId: string }> }
) {
  const params = await props.params
  try {
    const { userId } = await auth();
    const { quizId } = await req.json();

    const relationId = params.relationId;

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
        quiz_id: quizId,
      },
    });

    return NextResponse.json(quizToCourse);
  } catch (error) {
    console.log("COURSE_ID_QUIZ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
