import { NextRequest, NextResponse } from "next/server";
import { getEnv, maskKey, getUserKeys, setUserKeys, getEffectiveKey } from "@/lib/server/config";

// GET /api/settings/keys — trả về trạng thái keys (đã mask, không lộ key thật)
export async function GET() {
  const userId = "default"; // TODO: lấy từ session (NextAuth)
  const userKeys = getUserKeys(userId);
  const envKeys = {
    google: getEnv("GOOGLE_API_KEY"),
    openai: getEnv("OPENAI_API_KEY"),
    replicate: getEnv("REPLICATE_API_TOKEN"),
    stability: getEnv("STABILITY_API_KEY"),
    elevenlabs: getEnv("ELEVENLABS_API_KEY"),
    anthropic: getEnv("ANTHROPIC_API_KEY"),
  };

  const status = Object.entries(envKeys).map(([k, v]) => ({
    provider: k,
    configured: !!v || !!(userKeys?.[k]),
    source: userKeys?.[k] ? "user-settings" : v ? "env" : "missing",
    masked: maskKey((userKeys?.[k] || v || "") as string),
  }));

  return NextResponse.json({ status, mode: getEnv("NEXT_PUBLIC_AI_MODE") || "live" });
}

// POST /api/settings/keys { google, openai, replicate, elevenlabs, stability }
// Lưu keys của user (trong production sẽ mã hóa và lưu DB)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = "default"; // TODO: next-auth session

  const allowed = ["google", "openai", "replicate", "stability", "elevenlabs", "anthropic", "google_tts"];
  const toSave: Record<string, string> = {};
  for (const k of allowed) {
    if (body[k] && typeof body[k] === "string" && body[k].trim().length > 3) {
      toSave[k] = body[k].trim();
    }
  }

  // Validate bằng cách test 1 call nhẹ (optional)
  if (Object.keys(toSave).length === 0) {
    return NextResponse.json({ error: "Không có key hợp lệ" }, { status: 400 });
  }

  setUserKeys(userId, { ...(getUserKeys(userId) || {}), ...toSave });

  return NextResponse.json({
    ok: true,
    saved: Object.keys(toSave),
    message: "Đã lưu keys (bản chính thức: keys được lưu server, không lộ ra frontend). Trong production với DB, sẽ mã hóa AES-256.",
  });
}

// DELETE /api/settings/keys?provider=google
export async function DELETE(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  const userId = "default";
  const uk = getUserKeys(userId);
  if (uk && provider && uk[provider]) {
    delete uk[provider];
    setUserKeys(userId, uk);
  }
  return NextResponse.json({ ok: true, message: `Đã xóa ${provider}` });
}
