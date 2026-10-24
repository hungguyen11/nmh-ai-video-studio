import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/config";
import { ttsWithElevenLabs } from "@/lib/server/providers/elevenlabs";
import { ttsWithOpenAI } from "@/lib/server/providers/openai";
import { synthesizeWithGoogleTTS } from "@/lib/server/providers/google";

// POST /api/ai/tts { text, voice, sceneId }
export async function POST(req: NextRequest) {
  const { text, voice = "female-warm" } = await req.json();
  if (!text || typeof text !== "string" || text.length < 1) {
    return NextResponse.json({ error: "Thiếu text" }, { status: 400 });
  }
  if (text.length > 5000) return NextResponse.json({ error: "Text quá dài (max 5000)" }, { status: 400 });

  const elevenKey = getEnv("ELEVENLABS_API_KEY");
  const openaiKey = getEnv("OPENAI_API_KEY");
  const googleKey = getEnv("GOOGLE_API_KEY") || getEnv("GOOGLE_TTS_API_KEY");

  // Ưu tiên: ElevenLabs (chất lượng cao) → Google Cloud TTS (tiếng Việt tốt) → OpenAI TTS → lỗi hướng dẫn
  try {
    if (elevenKey) {
      const audioDataUrl = await ttsWithElevenLabs(text, elevenKey, voice);
      return NextResponse.json({ provider: "elevenlabs", audioUrl: audioDataUrl, format: "mp3" });
    }
    if (googleKey) {
      const audioDataUrl = await synthesizeWithGoogleTTS(text, googleKey, voice);
      return NextResponse.json({ provider: "google-tts", audioUrl: audioDataUrl, format: "mp3" });
    }
    if (openaiKey) {
      const audioDataUrl = await ttsWithOpenAI(text, openaiKey, voice);
      return NextResponse.json({ provider: "openai-tts", audioUrl: audioDataUrl, format: "mp3" });
    }
    return NextResponse.json(
      {
        error: "Chưa cấu hình TTS API key",
        hint: "Thêm ELEVENLABS_API_KEY (chất giọng hay nhất) hoặc GOOGLE_API_KEY (hỗ trợ tiếng Việt tốt) trong .env.local hoặc Cài đặt → Kết nối AI.",
        needKey: true,
        // Fallback client-side: Web Speech API (browser) vẫn hoạt động, nhưng đây là bản chính thức nên báo rõ
        fallback: "client-web-speech",
      },
      { status: 428 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
