/**
 * ElevenLabs Provider — giọng đọc cao cấp, hỗ trợ tiếng Việt
 */
export async function ttsWithElevenLabs(text: string, apiKey: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM") {
  if (!apiKey) throw new Error("Thiếu ELEVENLABS_API_KEY");
  // Map voice
  const voiceMap: Record<string, string> = {
    "female-warm": "21m00Tcm4TlvDq8ikWAM", // Rachel
    "male-deep": "VR6AewLTigWG4xSOukaG", // Arnold
    "child": "XB0fDUnXU5powFXDhCwa",
  };
  const vid = voiceMap[voiceId] || voiceId || "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0,300)}`);
  const buf = await res.arrayBuffer();
  return `data:audio/mpeg;base64,${Buffer.from(buf).toString("base64")}`;
}

export async function listVoicesElevenLabs(apiKey: string) {
  const res = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": apiKey } });
  if (!res.ok) throw new Error(`ElevenLabs list ${res.status}`);
  return res.json();
}
