import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Extrahiere den JSON-Body der Anfrage
    const body = await request.json();

    // Extrahiere quiz_name aus dem Body
    const { quizName } = body;

    // Neues Quiz erstellen (ohne course_id)
    const newQuiz = await db.quiz.create({
      data: {
        createdBy: userId,
        quiz_name: quizName,
      },
    });

    return NextResponse.json(
      { message: "Quiz created successfully", quiz: newQuiz },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quiz entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}