import { NextRequest, NextResponse } from "next/server";

// POST /api/ai/subtitles { text } -> trả về SRT/WebVTT
export async function POST(req: NextRequest) {
  const { text, duration = 60 } = await req.json();
  if (!text) return NextResponse.json({ error: "Thiếu text" }, { status: 400 });

  // Tạo SRT đơn giản từ text — bản chính thức sẽ dùng Whisper khi có audio
  const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
  const perSentence = duration / Math.max(1, sentences.length);
  let srt = "";
  sentences.forEach((sentence: string, i: number) => {
    const start = perSentence * i;
    const end = perSentence * (i + 1);
    const fmt = (sec: number) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const ms = Math.floor((sec % 1) * 1000);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
    };
    srt += `${i + 1}\n${fmt(start)} --> ${fmt(end)}\n${sentence.trim()}\n\n`;
  });

  return NextResponse.json({ provider: "local-srt", srt, vtt: srt.replace(/,/g, ".") });
}
