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

    const newUser = await db.user.create({
      data: { ...body },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user_id: newUser.user_id,
      },
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
