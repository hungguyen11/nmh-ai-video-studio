import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/config";
import { generateScriptWithGemini } from "@/lib/server/providers/google";
import { generateScriptWithOpenAI } from "@/lib/server/providers/openai";

// POST /api/ai/generate-script
// body: { topic, contentStyle, visualStyle, language }
export async function POST(req: NextRequest) {
  const { topic, contentStyle, visualStyle, language } = await req.json();

  if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
    return NextResponse.json({ error: "Chủ đề không hợp lệ" }, { status: 400 });
  }
  if (topic.length > 1000) return NextResponse.json({ error: "Chủ đề quá dài" }, { status: 400 });

  const googleKey = getEnv("GOOGLE_API_KEY");
  const openaiKey = getEnv("OPENAI_API_KEY");

  // Ưu tiên Google Gemini (miễn phí generous), fallback OpenAI, fallback mock
  try {
    if (googleKey) {
      const result = await generateScriptWithGemini(topic, `${contentStyle} + ${visualStyle} (${language})`, googleKey);
      return NextResponse.json({ provider: "google-gemini", ...result });
    }
    if (openaiKey) {
      const result = await generateScriptWithOpenAI(topic, `${contentStyle}`, openaiKey);
      return NextResponse.json({ provider: "openai-gpt", ...result });
    }
    // Nếu chưa có key, trả về lỗi hướng dẫn user (không giả lập ở bản chính thức)
    return NextResponse.json(
      {
        error: "Chưa cấu hình API key",
        hint: "Vào Cài đặt → Kết nối AI Provider → nhập GOOGLE_API_KEY (https://aistudio.google.com/app/apikey) hoặc OPENAI_API_KEY, rồi thử lại.",
        needKey: true,
      },
      { status: 428 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi tạo kịch bản", provider: "error" }, { status: 500 });
  }
}
