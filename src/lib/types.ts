export type ContentStyle = 'Documentary' | 'Animation' | 'POV' | 'Motion Graphics' | 'Cinematic' | 'Storytelling';
export type VisualStyle = '3D Cute' | '2D Animation' | 'Photorealistic' | '3D Semi-real' | 'Vector' | 'Stop Motion' | 'Pastel 2.5D';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type ProjectStatus = 'draft' | 'scripting' | 'storyboard' | 'generating' | 'editing' | 'exporting' | 'completed' | 'error';
export type SceneStatus = 'pending' | 'generating' | 'done' | 'error';
export type VoiceType = 'female-warm' | 'male-deep' | 'child' | 'news' | 'story';

export interface Scene {
  id: string;
  index: number;
  title: string;
  duration: number; // seconds
  narration: string;
  visualPrompt: string;
  videoPrompt: string;
  camera: string;
  transition: string;
  thumbnail?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  status: SceneStatus;
  progress?: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  traits: string;
  outfit: string;
  colorPalette: string;
}

export interface ProjectConfig {
  contentStyle: ContentStyle;
  visualStyle: VisualStyle;
  aspectRatio: AspectRatio;
  duration: number; // minutes
  resolution: '720p' | '1080p' | '4K';
  language: string;
  voice: VoiceType;
  music: boolean;
  subtitles: boolean;
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  status: ProjectStatus;
  progress: number;
  config: ProjectConfig;
  script?: {
    objective: string;
    scenesOutline: string[];
    fullScript: string;
  };
  scenes: Scene[];
  characters: Character[];
  createdAt: string;
  updatedAt: string;
  exportedUrl?: string;
  usage?: { cost: number; credits: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'business';
  credits: { used: number; total: number };
}
