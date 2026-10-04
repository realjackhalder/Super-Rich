import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json(
        { status: "error", message: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createAdminSession(username);

    return NextResponse.json({ status: "success", message: "Authenticated" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
