"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project, User, Scene, ProjectConfig } from "./types";
import { v4 as uuid } from "uuid";

type Store = {
  user: User | null;
  projects: Project[];
  currentProjectId: string | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  createProject: (topic: string, config?: Partial<ProjectConfig>) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrent: (id: string | null) => void;
  addScene: (projectId: string, scene: Partial<Scene>) => void;
  updateScene: (projectId: string, sceneId: string, patch: Partial<Scene>) => void;
  removeScene: (projectId: string, sceneId: string) => void;
  reorderScenes: (projectId: string, from: number, to: number) => void;
};

const defaultUser: User = {
  id: "u1",
  name: "Nguyễn Minh",
  email: "minh@nmh.studio",
  avatar: "https://i.pravatar.cc/200?img=12",
  plan: "free",
  credits: { used: 12, total: 20 },
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      projects: [
        {
          id: "p1",
          title: "Vì sao máy tính Windows bị chậm?",
          topic: "Giải thích vì sao máy tính Windows bị chậm và cách khắc phục",
          status: "editing",
          progress: 68,
          config: { contentStyle: "Documentary", visualStyle: "Photorealistic", aspectRatio: "16:9", duration: 2, resolution: "1080p", language: "vi-VN", voice: "female-warm", music: true, subtitles: true },
          script: { objective: "Giải thích nguyên nhân và cách khắc phục máy chậm", scenesOutline: ["Mở đầu", "Nguyên nhân", "Cách 1", "Cách 2", "Kết luận"], fullScript: "Máy tính Windows bị chậm do nhiều nguyên nhân..." },
          scenes: [
            { id: "s1", index: 1, title: "Giới thiệu vấn đề", duration: 12, narration: "Máy tính Windows của bạn bỗng dưng chạy chậm? Nguyên nhân là gì?", visualPrompt: "Woman with laptop, office background, cinematic", videoPrompt: "slow zoom in", camera: "Cận cảnh + Zoom nhẹ", transition: "Fade", status: "done", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", progress: 100 },
            { id: "s2", index: 2, title: "Nguyên nhân", duration: 18, narration: "Các file rác, phần mềm chạy nền và ổ cứng đầy là thủ phạm chính.", visualPrompt: "Computer internals, animation", videoPrompt: "pan right", camera: "Toàn cảnh", transition: "Cut", status: "done", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400", progress: 100 },
            { id: "s3", index: 3, title: "Cách khắc phục 1", duration: 15, narration: "Dọn dẹp file tạm, gỡ ứng dụng không dùng.", visualPrompt: "Cleaning computer screen", videoPrompt: "zoom out", camera: "Trung cảnh", transition: "Slide", status: "generating", progress: 45, thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400" },
            { id: "s4", index: 4, title: "Cách khắc phục 2", duration: 15, narration: "Nâng cấp RAM, SSD để tăng tốc.", visualPrompt: "RAM and SSD upgrade", videoPrompt: "dolly in", camera: "Cận", transition: "Fade", status: "pending", progress: 0, thumbnail: "https://images.unsplash.com/photo-1555617117-2412cc56ba5d?w=400" },
            { id: "s5", index: 5, title: "Kết luận", duration: 10, narration: "Áp dụng ngay để máy chạy mượt mà hơn!", visualPrompt: "Happy user with fast laptop", videoPrompt: "static", camera: "Trung cảnh", transition: "Fade", status: "pending", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" },
          ],
          characters: [
            { id: "c1", name: "Nhân vật 1", description: "Nữ 28-30 tuổi, văn phòng", avatar: "https://i.pravatar.cc/200?img=32", traits: "Thân thiện, chuyên nghiệp", outfit: "Sơ mi xanh", colorPalette: "Pastel" },
            { id: "c2", name: "Nhân vật 2", description: "Nam 30 tuổi", avatar: "https://i.pravatar.cc/200?img=15", traits: "Tự tin", outfit: "Áo thun", colorPalette: "Warm" },
          ],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "p2",
          title: "Khám phá vũ trụ: Hố đen là gì?",
          topic: "Giải thích hố đen vũ trụ cho người mới",
          status: "generating",
          progress: 32,
          config: { contentStyle: "Cinematic", visualStyle: "3D Cute", aspectRatio: "16:9", duration: 1, resolution: "1080p", language: "vi-VN", voice: "male-deep", music: true, subtitles: true },
          scenes: [
            { id: "s1", index: 1, title: "Mở đầu vũ trụ", duration: 10, narration: "Vũ trụ bao la chứa những bí ẩn...", visualPrompt: "Space nebula", videoPrompt: "slow pan", camera: "Wide", transition: "Fade", status: "generating", progress: 60, thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400" },
          ],
          characters: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "p3",
          title: "Du lịch Đà Nẵng - Thành phố đáng sống",
          topic: "Review du lịch Đà Nẵng",
          status: "completed",
          progress: 100,
          config: { contentStyle: "Storytelling", visualStyle: "Photorealistic", aspectRatio: "16:9", duration: 2, resolution: "1080p", language: "vi-VN", voice: "female-warm", music: true, subtitles: false },
          scenes: [],
          characters: [],
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date().toISOString(),
          exportedUrl: "#",
        },
      ],
      currentProjectId: null,
      login: (email, name) => set({ user: { ...defaultUser, email, name } }),
      logout: () => set({ user: null }),
      createProject: (topic, cfg) => {
        const id = uuid().slice(0, 8);
        const now = new Date().toISOString();
        const project: Project = {
          id, title: topic.slice(0, 50) || "Dự án không tên", topic, status: "draft", progress: 5,
          config: {
            contentStyle: "Documentary", visualStyle: "Photorealistic", aspectRatio: "16:9", duration: 1, resolution: "1080p", language: "vi-VN", voice: "female-warm", music: true, subtitles: true,
            ...cfg,
          },
          scenes: [], characters: [], createdAt: now, updatedAt: now,
        };
        set({ projects: [project, ...get().projects], currentProjectId: id });
        return id;
      },
      updateProject: (id, patch) => set({ projects: get().projects.map(p => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p) }),
      deleteProject: (id) => set({ projects: get().projects.filter(p => p.id !== id), currentProjectId: get().currentProjectId === id ? null : get().currentProjectId }),
      setCurrent: (id) => set({ currentProjectId: id }),
      addScene: (projectId, scene) => {
        const proj = get().projects.find(p => p.id === projectId);
        if (!proj) return;
        const newScene: Scene = {
          id: uuid().slice(0, 6), index: proj.scenes.length + 1, title: scene.title || `Cảnh ${proj.scenes.length + 1}`,
          duration: scene.duration || 10, narration: scene.narration || "", visualPrompt: scene.visualPrompt || "", videoPrompt: scene.videoPrompt || "", camera: scene.camera || "Trung cảnh", transition: scene.transition || "Fade",
          status: "pending", thumbnail: scene.thumbnail || `https://picsum.photos/seed/${Math.random()}/400/225`, ...scene,
        };
        get().updateProject(projectId, { scenes: [...proj.scenes, newScene] });
      },
      updateScene: (projectId, sceneId, patch) => {
        const proj = get().projects.find(p => p.id === projectId);
        if (!proj) return;
        get().updateProject(projectId, { scenes: proj.scenes.map(s => s.id === sceneId ? { ...s, ...patch } : s) as Scene[] });
      },
      removeScene: (projectId, sceneId) => {
        const proj = get().projects.find(p => p.id === projectId);
        if (!proj) return;
        const filtered = proj.scenes.filter(s => s.id !== sceneId).map((s, i) => ({ ...s, index: i + 1 }));
        get().updateProject(projectId, { scenes: filtered });
      },
      reorderScenes: (projectId, from, to) => {
        const proj = get().projects.find(p => p.id === projectId);
        if (!proj) return;
        const arr = [...proj.scenes];
        const [moved] = arr.splice(from, 1);
        arr.splice(to, 0, moved);
        get().updateProject(projectId, { scenes: arr.map((s, i) => ({ ...s, index: i + 1 })) });
      },
    }),
    { name: "nmh-studio-v2", version: 2 }
  )
);
