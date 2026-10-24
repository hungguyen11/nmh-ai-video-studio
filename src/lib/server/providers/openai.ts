/**
 * OpenAI Provider — script, image (DALL·E 3), TTS
 */
export async function generateScriptWithOpenAI(topic: string, style: string, apiKey: string) {
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Bạn là biên kịch video AI. Trả về JSON thuần, không markdown." },
        { role: "user", content: `Tạo kịch bản cho "${topic}" phong cách ${style}. Trả JSON: {objective, scenesOutline: string[5], fullScript, scenes: [{title, duration, narration, visualPrompt (tiếng Anh), videoPrompt, camera, transition}]}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0,300)}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  return JSON.parse(content);
}

export async function generateImageWithOpenAI(prompt: string, apiKey: string) {
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "dall-e-3", prompt, size: "1792x1024", quality: "standard", n: 1 }),
  });
  if (!res.ok) throw new Error(`OpenAI Image ${res.status}: ${(await res.text()).slice(0,300)}`);
  const data = await res.json();
  return data.data?.[0]?.url as string;
}

export async function ttsWithOpenAI(text: string, apiKey: string, voice: string = "alloy") {
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "tts-1", voice: voice.includes("female") ? "nova" : "onyx", input: text, speed: 1.0 }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS ${res.status}`);
  const buf = await res.arrayBuffer();
  return `data:audio/mpeg;base64,${Buffer.from(buf).toString("base64")}`;
}
