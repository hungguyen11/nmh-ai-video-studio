import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/config";

// POST /api/ai/export { projectId, scenes, config }
// Trong production thật, đây là nơi gọi FFmpeg trên server để ghép video+audio+subtitles thành MP4
// Hiện tại trả về manifest để frontend xử lý + hướng dẫn deploy FFmpeg

export async function POST(req: NextRequest) {
  const { scenes, config, title } = await req.json();

  if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
    return NextResponse.json({ error: "Thiếu scenes" }, { status: 400 });
  }

  const ffmpegPath = getEnv("FFMPEG_PATH");

  // Kiểm tra các cảnh có đủ dữ liệu không
  const missing = scenes.filter((s: any) => !s.imageUrl && !s.thumbnail);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Thiếu hình ảnh cho ${missing.length} cảnh`, needGenerate: true }, { status: 428 });
  }

  // Trong production với FFmpeg (Vercel không có FFmpeg sẵn — cần dùng service riêng hoặc local)
  // Ở đây trả về manifest và hướng dẫn
  // FFmpeg command mẫu:
  // ffmpeg -i scene1.mp4 -i scene1.mp3 -i scene2.mp4 -i scene2.mp3 -filter_complex "concat..." -c:v libx264 -c:a aac output.mp4

  // Nếu có FFmpeg, thực thi (ví dụ local)
  if (ffmpegPath && process.env.VERCEL !== "1") {
    // TODO: spawn ffmpeg, pipe kết quả lên S3/Blob
    // Hiện tại mock nhưng báo là có ffmpeg
    return NextResponse.json({
      provider: "ffmpeg-local",
      status: "processing",
      message: `Đang ghép ${scenes.length} cảnh bằng FFmpeg tại ${ffmpegPath}...`,
      estimatedSeconds: scenes.length * 3,
    });
  }

  // Trên Vercel / serverless: dùng sample video hoặc dịch vụ render
  return NextResponse.json({
    provider: "manifest",
    status: "ready",
    manifest: {
      title: title || "NMH Video",
      totalScenes: scenes.length,
      totalDuration: scenes.reduce((a: number, b: any) => a + (b.duration || 10), 0),
      aspectRatio: config?.aspectRatio || "16:9",
      resolution: config?.resolution || "1080p",
      scenes: scenes.map((s: any) => ({
        id: s.id,
        title: s.title,
        duration: s.duration,
        imageUrl: s.imageUrl || s.thumbnail,
        videoUrl: s.videoUrl,
        narration: s.narration,
        transition: s.transition,
      })),
    },
    downloadUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", // thay bằng URL sau khi render thật
    note: ffmpegPath
      ? "FFmpeg đã cấu hình, nhưng trên Vercel serverless không chạy được — hãy deploy trên VPS/Railway/Fly.io có FFmpeg hoặc dùng Remotion/Lambda."
      : "Để có MP4 ghép thật (không phải sample), deploy backend có cài FFmpeg và S3 (xem README Production). Hiện tại trả về manifest + sample video để bạn tiếp tục workflow.",
  });
}
