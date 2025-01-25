import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Datenbankabfrage des Benutzers
    const user = await db.user.findUnique({
        where: { user_id: userId },
        select: { user_role: true },
        });

    // Falls der User kein Admin ist, wird eine Fehlermeldung zurückgegeben
    if (!user || user.user_role !== "ADMIN") {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
        );
    }
    
    const quizId = parseInt(params.quiz_id, 10);

    // Extrahiere den JSON-Body der Anfrage
    const body = await request.json();
    
    // Extrahiere quiz_name aus dem Body
    const { questionTitle } = body;

    const newQuestion = await db.question.create({
      data: {
        quiz_id: quizId,
        createdBy: userId,
        question_title: questionTitle,
      },
    });

    return NextResponse.json(
      { message: "Quiz created successfully", quiz: newQuestion },
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