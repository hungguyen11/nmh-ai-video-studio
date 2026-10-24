/**
 * Server config — đọc ENV an toàn, không bao giờ lộ ra frontend
 */
export function getEnv(name: string) {
  return process.env[name] || "";
}

export function getAllKeys() {
  return {
    google: getEnv("GOOGLE_API_KEY") || getEnv("GOOGLE_TTS_API_KEY"),
    openai: getEnv("OPENAI_API_KEY"),
    replicate: getEnv("REPLICATE_API_TOKEN"),
    stability: getEnv("STABILITY_API_KEY"),
    elevenlabs: getEnv("ELEVENLABS_API_KEY"),
    huggingface: getEnv("HUGGINGFACE_API_KEY"),
  };
}

export function hasAnyKey() {
  const k = getAllKeys();
  return !!(k.google || k.openai || k.replicate || k.elevenlabs || k.stability);
}

export function maskKey(key: string) {
  if (!key) return "—";
  if (key.length <= 8) return "••••";
  return key.slice(0, 4) + "••••" + key.slice(-4);
}

// User-provided keys (stored in DB or memory for multi-tenant)
// For production, persist in DB encrypted. Here we keep in-memory fallback.
const userKeysStore = new Map<string, Record<string, string>>();

export function setUserKeys(userId: string, keys: Record<string, string>) {
  userKeysStore.set(userId, keys);
}
export function getUserKeys(userId: string) {
  return userKeysStore.get(userId) || null;
}
export function getEffectiveKey(provider: string, userId?: string) {
  if (userId) {
    const uk = getUserKeys(userId);
    if (uk?.[provider]) return uk[provider];
  }
  const envKeys = getAllKeys() as any;
  return envKeys[provider] || "";
}
