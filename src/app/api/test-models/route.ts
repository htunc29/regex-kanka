import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable bulunamadı!" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);


    const modelNames = [
      "gemini-2.5-flash",
      "gemini-2.0-flash-exp",
      "gemini-exp-1206",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro",
      "gemini-1.5-pro-latest",
      "gemini-pro",
    ];

    const results = [];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test");
        const response = await result.response;
        results.push({
          model: modelName,
          status: "✅ Çalışıyor",
          response: response.text().substring(0, 50) + "...",
        });
      } catch (error: any) {
        results.push({
          model: modelName,
          status: "❌ Hata",
          error: error.message.substring(0, 100),
        });
      }
    }

    
    const workingModel = results.find((r) => r.status === "✅ Çalışıyor");
    const currentModel = process.env.GEMINI_MODEL;

    return NextResponse.json({
      message: "Gemini Model Test Sonuçları",
      currentModel: currentModel || "Tanımlı değil",
      recommendedModel: workingModel?.model || "Hiçbiri çalışmıyor!",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Test sırasında hata oluştu",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
