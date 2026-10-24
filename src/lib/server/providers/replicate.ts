/**
 * Replicate Provider — SDXL Image, Stable Video Diffusion, Luma Dream Machine
 * Docs: https://replicate.com/docs
 */
export async function generateImageWithReplicate(prompt: string, apiKey: string) {
  if (!apiKey) throw new Error("Thiếu REPLICATE_API_TOKEN");
  // Create prediction
  const create = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "7762fd07cf82c948538e41f63f77d685e02b063e55d2e14749adc1463128f216", // SDXL
      input: { prompt, width: 1280, height: 720 },
    }),
  });
  if (!create.ok) throw new Error(`Replicate ${create.status}: ${(await create.text()).slice(0,300)}`);
  const pred = await create.json();
  // Poll until done (max 40s)
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Token ${apiKey}` },
    });
    const j = await poll.json();
    if (j.status === "succeeded") return j.output?.[0] as string;
    if (j.status === "failed") throw new Error(`Replicate failed: ${j.error}`);
  }
  throw new Error("Replicate timeout");
}

export async function startVideoWithReplicate(imageUrl: string, prompt: string, apiKey: string) {
  if (!apiKey) throw new Error("Thiếu REPLICATE_API_TOKEN");
  const create = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "3f0457e4619daac51203dedb472816fd4af51ff0369b78b44e4ff43e0e6f6f8a", // stable-video-diffusion
      input: { image: imageUrl, motion_bucket_id: 127, fps: 6, motion_bucket_id: 127 },
    }),
  });
  if (!create.ok) throw new Error(`Replicate Video ${create.status}`);
  const j = await create.json();
  return j.id as string;
}

export async function pollVideoReplicate(taskId: string, apiKey: string) {
  const r = await fetch(`https://api.replicate.com/v1/predictions/${taskId}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  const j = await r.json();
  if (j.status === "succeeded") return { status: "done" as const, url: j.output as string, progress: 100 };
  if (j.status === "failed") return { status: "error" as const, progress: 0, error: j.error };
  return { status: "pending" as const, progress: 30 };
}
