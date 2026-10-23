// Adapter pattern for AI providers. Demo mode by default.
export interface ImageProvider { generate(prompt: string, style: string): Promise<{ url: string, id: string }>; }
export interface VideoProvider { generate(imageUrl: string, prompt: string): Promise<{ taskId: string }>; poll(taskId: string): Promise<{ status: 'pending' | 'done' | 'error', progress: number, url?: string }>; }
export interface TTSProvider { synthesize(text: string, voice: string): Promise<{ url: string }>; }

export const envMode = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AI_MODE) || 'demo'; // 'demo' | 'live'

export const DemoImageProvider: ImageProvider = {
  async generate(prompt) {
    // return picsum with prompt seed
    const seed = encodeURIComponent(prompt.slice(0, 20));
    return { url: `https://picsum.photos/seed/${seed}-${Date.now()}/1280/720`, id: 'demo-' + Date.now() };
  }
};
export const DemoVideoProvider: VideoProvider = {
  async generate() { return { taskId: 'demo-' + Date.now() }; },
  async poll() { return { status: 'done', progress: 100, url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' }; }
};
export const DemoTTSProvider: TTSProvider = {
  async synthesize() { return { url: '' }; }
};

export function getProviders() {
  if (envMode === 'demo') return { image: DemoImageProvider, video: DemoVideoProvider, tts: DemoTTSProvider, mode: 'demo' as const };
  // TODO: plug real providers (Replicate, Stability, ElevenLabs, OpenAI)
  return { image: DemoImageProvider, video: DemoVideoProvider, tts: DemoTTSProvider, mode: 'live' as const };
}
