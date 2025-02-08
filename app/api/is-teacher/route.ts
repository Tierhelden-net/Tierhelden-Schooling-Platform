import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

// http://localhost:3000/api/is-teacher -- API is working
/* export async function GET() {
  return NextResponse.json({ message: "API is working! Use POST to send data." });
} */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    //console.log("API received userId:", userId); // Debugging
    const teacherStatus = await isTeacher(userId); // Lehrerstatus überprüfen
    //console.log("API returning isTeacher:", teacherStatus); // Debugging

    return NextResponse.json({ isTeacher: teacherStatus });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
