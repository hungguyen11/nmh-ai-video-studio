"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Input, Label, Select, Textarea } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Type, Music, Wand2, Download, Save, Sparkles } from "lucide-react";

export default function StudioPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const updateScene = useStore(s => s.updateScene);
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  useEffect(() => { if (project && !selected && project.scenes[0]) setSelected(project.scenes[0].id); }, [project, selected]);
  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;

  const sel = project.scenes.find(s => s.id === selected) || project.scenes[0];
  const total = project.scenes.reduce((a, b) => a + b.duration, 0);

  const doExport = () => {
    setExporting(true);
    updateProject(project.id, { status: "exporting" });
    setTimeout(() => { setExporting(false); setExportDone(true); updateProject(project.id, { status: "completed", progress: 100, exportedUrl: "#" }); }, 2200);
  };

  return (
    <div className="space-y-4">
      <StudioSteps projectId={project.id} current={5} />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Studio biên tập — {project.title}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => updateProject(project.id, { status: "editing" })}><Save size={16} className="mr-2" />Lưu dự án</Button>
          <Button onClick={doExport} disabled={exporting} className="bg-emerald-600 hover:bg-emerald-700">{exporting ? "Đang xuất..." : exportDone ? "Đã xuất ✓" : <><Download size={16} className="mr-2" />Xuất MP4</>}</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr_320px] gap-4">
        {/* Left: scene list + tools */}
        <div className="space-y-3">
          <Card className="p-2 flex gap-1 overflow-auto">
            {[
              { k: "Video", icon: "🎬" }, { k: "Âm thanh", icon: "🎵" }, { k: "Phụ đề", icon: "CC" }, { k: "Hiệu ứng", icon: "✨" }, { k: "Tài nguyên", icon: "📦" },
            ].map(t => <button key={t.k} className="flex-1 px-2 py-2 rounded-xl bg-[#F5F3FF] border border-[#E9ECF5] text-xs font-medium flex flex-col items-center gap-1"><span>{t.icon}</span>{t.k}</button>)}
          </Card>

          <Card className="p-2">
            <div className="text-xs font-medium px-2 py-1 flex justify-between">Danh sách cảnh <Badge tone="purple">{project.scenes.length}</Badge></div>
            <div className="mt-2 space-y-2 max-h-[60vh] overflow-auto">
              {project.scenes.map(s => (
                <button key={s.id} onClick={() => setSelected(s.id)} className={`w-full text-left flex gap-2 p-2 rounded-xl border ${selected === s.id ? "border-[#7C5BFF] bg-[#F5F3FF]" : "border-[#E9ECF5] bg-white hover:bg-gray-50"}`}>
                  <img src={s.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{s.index}. {s.title}</div>
                    <div className="text-[11px] text-gray-500">{s.duration}s • {s.status}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Center: preview + timeline */}
        <div className="space-y-3">
          <Card className="overflow-hidden">
            <div className="bg-gray-900 aspect-video relative flex items-center justify-center overflow-hidden">
              {sel ? <img src={sel.imageUrl || sel.thumbnail} alt="" className="w-full h-full object-cover" /> : <div className="text-white/60 text-sm">Chưa chọn cảnh</div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur border border-white/10">Windows bị chậm?</div>
              </div>
              <button onClick={() => setPlaying(v => !v)} className="absolute w-12 h-12 rounded-full bg-white grid place-items-center shadow-lg">
                {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium">00:{String(currentTime).padStart(2, "0")} / 01:{String(total).padStart(2, "0")}</div>
              <div className="absolute top-3 right-3 flex gap-1">
                <span className="px-2 py-1 rounded-full bg-white text-xs">16:9</span>
                <span className="px-2 py-1 rounded-full bg-[#7C5BFF] text-white text-xs">1080p</span>
              </div>
            </div>
            <div className="p-3 flex items-center gap-2 border-t bg-white">
              <button className="w-8 h-8 grid place-items-center rounded-full border"><SkipBack size={14} /></button>
              <button onClick={() => setPlaying(v => !v)} className="w-8 h-8 grid place-items-center rounded-full bg-[#7C5BFF] text-white">{playing ? <Pause size={14} /> : <Play size={14} />}</button>
              <button className="w-8 h-8 grid place-items-center rounded-full border"><SkipForward size={14} /></button>
              <div className="flex-1 mx-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#7C5BFF]" style={{ width: `${Math.min(100, (currentTime / Math.max(1, total)) * 100)}%` }} /></div>
              <Volume2 size={16} className="text-gray-500" />
              <Type size={16} className="text-gray-500" />
              <Music size={16} className="text-gray-500" />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Timeline</h3>
              <div className="text-xs text-gray-500">Kéo để sắp xếp • Nhấn cảnh để chỉnh</div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex gap-1 overflow-auto pb-1">
                {project.scenes.map(s => (
                  <div key={s.id} onClick={() => setSelected(s.id)} className={`shrink-0 w-24 rounded-xl overflow-hidden border-2 cursor-pointer ${selected === s.id ? "border-[#7C5BFF]" : "border-[#E9ECF5]"}`}>
                    <img src={s.thumbnail} alt="" className="h-14 w-full object-cover" />
                    <div className="p-1.5 text-[11px] font-medium truncate bg-white">{s.title}</div>
                  </div>
                ))}
              </div>
              {/* Tracks */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium flex items-center gap-1">🎬 Video</span><div className="flex-1 h-6 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex overflow-hidden">{project.scenes.map(s => <div key={s.id} className="flex-1 border-r last:border-0 border-white/50 grid place-items-center text-[10px] font-medium">{s.index}</div>)}</div></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium flex items-center gap-1">🎤 Voice</span><div className="flex-1 h-6 rounded-full bg-emerald-50 border border-emerald-200 overflow-hidden relative"><div className="absolute inset-1 flex gap-0.5 items-center">{Array.from({ length: 24 }).map((_, i) => <div key={i} className="flex-1 bg-emerald-400 rounded-full" style={{ height: `${6 + Math.random() * 14}px` }} />)}</div></div></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium flex items-center gap-1">🎵 Nhạc</span><div className="flex-1 h-6 rounded-full bg-amber-50 border border-amber-200 overflow-hidden"><div className="h-full w-[92%] bg-amber-300 rounded-full" /></div></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium flex items-center gap-1">CC Phụ đề</span><div className="flex-1 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center px-2 text-[10px]">{sel?.narration.slice(0, 60)}...</div></div>
              </div>
            </div>
          </Card>

          {exportDone && (
            <Card className="p-4 bg-emerald-50 border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center">✓</div><div><div className="font-medium text-emerald-800">Xuất MP4 thành công (giả lập)!</div><div className="text-xs text-emerald-700">Tệp đã sẵn sàng tải về. Trong chế độ LIVE, backend sẽ dùng FFmpeg để ghép video/audio/phụ đề thật.</div></div></div>
              <a href="#" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium">Tải MP4</a>
            </Card>
          )}
        </div>

        {/* Right: inspector */}
        <Card className="p-4 h-fit">
          {!sel ? <div className="text-sm text-gray-500">Chọn một cảnh để chỉnh sửa</div> : (
            <>
              <h3 className="font-semibold">Thiết lập cảnh</h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-[#E9ECF5]">
                <img src={sel.imageUrl || sel.thumbnail} alt="" className="w-full h-28 object-cover" />
                <div className="p-3 bg-white">
                  <div className="text-sm font-medium">{sel.title}</div>
                  <div className="text-xs text-gray-500">Cảnh {sel.index} • {sel.duration}s • {sel.status}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div><Label>Nhân vật</Label><Select value="Nữ 28-30"><option>Nữ 28-30 tuổi — Văn phòng</option><option>Nam 30 tuổi</option></Select></div>
                <div><Label>Bối cảnh</Label><Input value="Văn phòng làm việc" onChange={() => { }} /></div>
                <div><Label>Phong cách</Label><Select value={project.config.visualStyle}><option>{project.config.visualStyle}</option></Select></div>
                <div><Label>Chuyển động camera</Label><Select value={sel.camera} onChange={e => updateScene(project.id, sel.id, { camera: e.target.value })}><option>Cận cảnh + Zoom nhẹ</option><option>Toàn cảnh</option><option>Trung cảnh</option><option>Pan phải</option></Select></div>
                <div><Label>Prompt</Label><Textarea value={sel.visualPrompt} onChange={e => updateScene(project.id, sel.id, { visualPrompt: e.target.value })} rows={3} /></div>
                <div className="p-2.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs text-gray-600">💡 Mẹo: Thêm &quot;cinematic lighting, 8k, highly detailed&quot; để ảnh nét hơn. Dùng reference nhân vật để giữ nhất quán.</div>
                <Button variant="outline" className="w-full"><Sparkles size={14} className="mr-2" />Sửa prompt bằng AI</Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
