import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    // userId aus Clerk auth() extrahieren
    const { userId } = auth();

    // Falls der Benutzer nicht angemeldet ist, wird eine Fehlermeldung zurückgegeben
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
    if (!user || !user.user_role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Alle Quizze aus der Datenbank abfragen
    const quizzes = await db.quiz.findMany();

    return NextResponse.json(
      { message: "Quizzes fetched successfully", quizzes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
