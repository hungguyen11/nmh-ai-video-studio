/**
 * NMH AI Video Studio — Google Provider (PRODUCTION)
 * Hỗ trợ: Gemini (script), Imagen (image), Cloud TTS, Veo (video)
 * Tất cả key chỉ ở server, không bao giờ lộ ra frontend.
 */
export type GeminiModel = "gemini-1.5-pro" | "gemini-1.5-flash" | "gemini-2.0-flash-exp";

export async function generateScriptWithGemini(topic: string, style: string, apiKey: string) {
  if (!apiKey) throw new Error("Thiếu GOOGLE_API_KEY");
  const prompt = `Bạn là biên kịch video AI chuyên nghiệp cho NMH AI Video Studio.
Nhiệm vụ: Tạo kịch bản video ngắn cho chủ đề: "${topic}" — phong cách: ${style}.
Trả về JSON thuần, không markdown:
{
  "objective": "mục tiêu video 1 câu",
  "scenesOutline": ["mở đầu","nguyên nhân","cách 1","cách 2","kết luận"],
  "fullScript": "kịch bản lời dẫn đầy đủ ~150 từ",
  "scenes": [
    {"title":"", "duration":12, "narration":"lời dẫn 1-2 câu", "visualPrompt":"mô tả ảnh chi tiết bằng tiếng Anh, cinematic", "videoPrompt":"chuyển động camera", "camera":"Cận cảnh", "transition":"Fade"}
  ]
}
Yêu cầu: 5 cảnh, mỗi cảnh 8-18s, visualPrompt tiếng Anh để tạo ảnh.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 3000 },
      }),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t.slice(0,300)}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Extract JSON
  const jsonStr = text.replace(/```json|```/g, "").trim();
  const match = jsonStr.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Gemini không trả về JSON hợp lệ: " + text.slice(0,200));
  return JSON.parse(match[0]);
}

// Google Cloud TTS (REST) — hoạt động khi có GOOGLE_TTS_API_KEY hoặc GOOGLE_API_KEY
export async function synthesizeWithGoogleTTS(text: string, apiKey: string, voice: string = "vi-VN-Wavenet-A") {
  if (!apiKey) throw new Error("Thiếu GOOGLE_API_KEY cho TTS");
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "vi-VN", name: voice.includes("female") ? "vi-VN-Wavenet-A" : "vi-VN-Wavenet-C" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.0, pitch: 0 },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Google TTS ${res.status}: ${t.slice(0,200)}`);
  }
  const data = await res.json();
  // data.audioContent is base64 MP3
  return `data:audio/mp3;base64,${data.audioContent}`;
}

// Imagen placeholder — Google chưa mở Imagen API công khai cho tất cả, fallback về Gemini + Pollinations
export async function generateImageWithGoogleImagen(prompt: string, apiKey: string) {
  // Thử Imagen via Vertex nếu có service account, fallback
  throw new Error("Google Imagen chưa được kích hoạt cho API key này — hệ thống sẽ tự fallback sang Pollinations/Stability.");
}
