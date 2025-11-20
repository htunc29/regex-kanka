import { regexAcikla } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { regex, test } = await req.json();

    if (!regex) {
      return NextResponse.json(
        { error: "Regex boş olamaz kanka!" },
        { status: 400 }
      );
    }

    const response = await regexAcikla(regex, test || "");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Gemini hatası:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bir şeyler ters gitti, tekrar dene kanka!",
      },
      { status: 500 }
    );
  }
}
