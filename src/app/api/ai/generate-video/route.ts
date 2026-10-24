import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/config";
import { startVideoWithReplicate, pollVideoReplicate } from "@/lib/server/providers/replicate";

// POST khởi tạo task: { imageUrl, prompt, sceneId }
// GET poll: ?taskId=xxx
export async function POST(req: NextRequest) {
  const { imageUrl, prompt } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: "Thiếu imageUrl" }, { status: 400 });

  const replicateKey = getEnv("REPLICATE_API_TOKEN");
  if (!replicateKey) {
    // Fallback: trả về video mẫu có thể phát được — không phải "giả lập", là video thật để user tiếp tục workflow
    // Trong bản chính thức, yêu cầu REPLICATE_API_TOKEN để có video AI thật từ SD Video Diffusion / Luma
    return NextResponse.json({
      provider: "sample-fallback",
      taskId: "sample_" + Date.now(),
      message: "Chưa có REPLICATE_API_TOKEN — đang dùng video mẫu. Thêm key để tạo video AI thật.",
      sampleUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    });
  }

  try {
    const taskId = await startVideoWithReplicate(imageUrl, prompt || "", replicateKey);
    return NextResponse.json({ provider: "replicate-svd", taskId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) return NextResponse.json({ error: "Thiếu taskId" }, { status: 400 });

  if (taskId.startsWith("sample_")) {
    return NextResponse.json({ status: "done", progress: 100, url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" });
  }

  const replicateKey = getEnv("REPLICATE_API_TOKEN");
  if (!replicateKey) return NextResponse.json({ error: "Thiếu REPLICATE_API_TOKEN" }, { status: 428 });

  try {
    const result = await pollVideoReplicate(taskId, replicateKey);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
