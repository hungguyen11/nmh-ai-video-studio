"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Input, Textarea, Label, Select } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { Plus, Trash2, GripVertical, RefreshCw, Play, Wand2 } from "lucide-react";
import { useState } from "react";
import { simulateGeneration } from "@/lib/mockAI";

export default function StoryboardPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const { updateScene, addScene, removeScene } = useStore();
  const [editing, setEditing] = useState<string | null>(null);

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;

  const genOne = async (sceneId: string) => {
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    updateScene(project.id, sceneId, { status: "generating", progress: 5 });
    await simulateGeneration(scene, (p) => updateScene(project.id, sceneId, { progress: p }));
    updateScene(project.id, sceneId, { status: "done", progress: 100 });
  };

  const genAll = async () => {
    for (const s of project.scenes) if (s.status !== "done") await genOne(s.id);
    useStore.getState().updateProject(project.id, { status: "editing", progress: 70 });
  };

  return (
    <div className="space-y-6">
      <StudioSteps projectId={project.id} current={4} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Storyboard — {project.title}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => addScene(project.id, { title: `Cảnh ${project.scenes.length + 1}`, duration: 10, narration: "Lời dẫn mới...", visualPrompt: "Mô tả hình ảnh", videoPrompt: "Camera move", camera: "Trung cảnh", transition: "Fade" })}><Plus size={16} className="mr-2" />Thêm cảnh</Button>
          <Button onClick={genAll}><Wand2 size={16} className="mr-2" />Tạo tất cả cảnh</Button>
        </div>
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div className="text-sm"><b>{project.scenes.length}</b> cảnh • Tổng ~ {project.scenes.reduce((a, b) => a + b.duration, 0)}s • Tỉ lệ {project.config.aspectRatio}</div>
        <Button onClick={() => router.push(`/projects/${project.id}/studio`)}>Tiếp tục tới Studio →</Button>
      </Card>

      <div className="space-y-3">
        {project.scenes.map(s => (
          <Card key={s.id} className="p-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7C5BFF] text-white grid place-items-center text-xs font-bold">{s.index}</div>
                <GripVertical size={16} className="text-gray-300" />
              </div>
              <img src={s.thumbnail} alt="" className="w-[160px] h-[90px] rounded-xl object-cover border border-[#E9ECF5] bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Input value={s.title} onChange={e => updateScene(project.id, s.id, { title: e.target.value })} className="font-medium text-sm h-8" />
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-50 border shrink-0">{s.duration}s</span>
                  <Badge tone={s.status === "done" ? "green" : s.status === "generating" ? "purple" : "gray"}>{s.status === "done" ? "Đã tạo" : s.status === "generating" ? "Đang tạo..." : "Chờ"}</Badge>
                </div>
                {s.status === "generating" && <div className="mt-2"><Progress value={s.progress || 0} /></div>}
                <div className="mt-3 grid lg:grid-cols-2 gap-3">
                  <div>
                    <Label>Lời dẫn</Label>
                    <Textarea value={s.narration} onChange={e => updateScene(project.id, s.id, { narration: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label>Prompt tạo hình ảnh</Label>
                    <Textarea value={s.visualPrompt} onChange={e => updateScene(project.id, s.id, { visualPrompt: e.target.value })} rows={2} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div><Label>Chuyển động camera</Label><Input value={s.camera} onChange={e => updateScene(project.id, s.id, { camera: e.target.value })} /></div>
                  <div><Label>Prompt video</Label><Input value={s.videoPrompt} onChange={e => updateScene(project.id, s.id, { videoPrompt: e.target.value })} /></div>
                  <div><Label>Chuyển cảnh</Label><Select value={s.transition} onChange={e => updateScene(project.id, s.id, { transition: e.target.value })}><option>Fade</option><option>Cut</option><option>Slide</option><option>Zoom</option></Select></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm" onClick={() => genOne(s.id)} disabled={s.status === "generating"}><RefreshCw size={14} className="mr-1" />{s.status === "done" ? "Tạo lại" : "Tạo"}</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(editing === s.id ? null : s.id)}>Sửa</Button>
                <Button size="sm" variant="ghost" onClick={() => removeScene(project.id, s.id)} className="text-red-600 hover:bg-red-50"><Trash2 size={14} /></Button>
              </div>
            </div>
          </Card>
        ))}
        {project.scenes.length === 0 && <Card className="p-10 text-center text-sm text-gray-500">Chưa có cảnh. Hãy quay lại bước trước để tạo kịch bản.</Card>}
      </div>
    </div>
  );
}
