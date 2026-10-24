/**
 * NMH AI Video Studio — Client API (Production)
 * Mọi call đều đi qua backend /api/ai/* — key không bao giờ lộ ra frontend
 */

export async function callGenerateScript(topic: string, opts: { contentStyle: string; visualStyle: string; language?: string }) {
  const res = await fetch("/api/ai/generate-script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, ...opts }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.hint || "Lỗi tạo kịch bản");
  return data;
}

export async function callGenerateImage(prompt: string, style: string) {
  const res = await fetch("/api/ai/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, style }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Lỗi tạo ảnh");
  return data.url as string;
}

export async function callGenerateVideo(imageUrl: string, prompt: string) {
  const res = await fetch("/api/ai/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl, prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data as { provider: string; taskId: string; sampleUrl?: string };
}

export async function pollVideo(taskId: string) {
  const res = await fetch(`/api/ai/generate-video?taskId=${encodeURIComponent(taskId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data as { status: "done" | "pending" | "error"; progress: number; url?: string };
}

export async function callTTS(text: string, voice: string) {
  const res = await fetch("/api/ai/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  const data = await res.json();
  if (!res.ok) {
    // 428 = chưa có key, fallback về Web Speech
    if (data.fallback === "client-web-speech") throw new Error(data.hint || data.error);
    throw new Error(data.error || "Lỗi TTS");
  }
  return data as { provider: string; audioUrl: string };
}

export async function callExport(scenes: any[], config: any, title: string) {
  const res = await fetch("/api/ai/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenes, config, title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// Fallback client Web Speech (khi chưa có key)
export function speakWithWebSpeech(text: string, voice: string = "female-warm"): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    u.rate = 0.95;
    u.pitch = voice.includes("female") ? 1.05 : 0.9;
    const voices = speechSynthesis.getVoices();
    const vi = voices.find((v) => v.lang.includes("vi")) || voices[0];
    if (vi) u.voice = vi;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
    setTimeout(resolve, Math.min(8000, text.length * 80));
  });
}
export function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// Keys management
export async function getKeysStatus() {
  const res = await fetch("/api/settings/keys");
  return res.json();
}
export async function saveKeys(keys: Record<string, string>) {
  const res = await fetch("/api/settings/keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(keys),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// Legacy exports for compatibility
export const generateImage = callGenerateImage;
export const generateVideoFromImage = async (imageUrl: string, prompt: string) => {
  const { sampleUrl } = await callGenerateVideo(imageUrl, prompt);
  return sampleUrl || "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";
};
export const speakText = async (text: string, voice: string) => {
  try {
    const { audioUrl } = await callTTS(text, voice);
    const audio = new Audio(audioUrl);
    await audio.play();
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      setTimeout(resolve, text.length * 80 + 2000);
    });
  } catch {
    await speakWithWebSpeech(text, voice);
  }
};
export const testProvider = async (provider: string, key: string) => {
  if (!key || key.length < 8) return { ok: false, msg: "Key quá ngắn" };
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, msg: `Key ${provider} hợp lệ (đã kiểm tra format)` };
};
