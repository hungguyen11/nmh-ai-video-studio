"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Input, Textarea, Label, Select, Modal, useToast } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { Plus, Trash2, GripVertical, RefreshCw, Wand2, Eye, Copy, Volume2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callGenerateImage, callTTS } from "@/lib/api";

export default function StoryboardPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const { updateScene, addScene, removeScene } = useStore();
  const [speaking, setSpeaking] = useState<string|null>(null);
  const [previewImg, setPreviewImg] = useState<string|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newScene, setNewScene] = useState({ title: "", duration: 10, narration: "" });
  const { toast, ToastContainer } = useToast();

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;

  const genOne = async (sceneId: string) => {
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    toast(`Đang gọi /api/ai/generate-image cho cảnh ${scene.index}...`, "info");
    updateScene(project.id, sceneId, { status: "generating", progress: 5 });
    try {
      // Gọi backend production — backend sẽ dùng OPENAI/REPLICATE hoặc Pollinations fallback
      const url = await callGenerateImage(scene.visualPrompt, project.config.visualStyle);
      let p = 10;
      const iv = setInterval(()=> {
        p += Math.random()*15 + 10;
        if (p >= 90) clearInterval(iv);
        else updateScene(project.id, sceneId, { progress: Math.round(p) });
      }, 300);
      await new Promise(r=>setTimeout(r, 800));
      clearInterval(iv);
      updateScene(project.id, sceneId, { status: "done", progress: 100, imageUrl: url, thumbnail: url });
      toast(`Cảnh ${scene.index} đã tạo xong!`, "success");
    } catch (e: any) {
      updateScene(project.id, sceneId, { status: "error", progress: 0 });
      toast(e.message || "Tạo cảnh thất bại", "error");
    }
  };

  const genAll = async () => {
    toast("Đang tạo tất cả cảnh qua /api/ai/generate-image...", "info");
    for (const s of project.scenes) if (s.status !== "done") await genOne(s.id);
    useStore.getState().updateProject(project.id, { status: "editing", progress: 70 });
    toast("Hoàn tất tạo tất cả cảnh!", "success");
  };

  const handleSpeak = async (scene: any) => {
    if (speaking === scene.id) { const { stopSpeaking } = await import("@/lib/api"); stopSpeaking(); setSpeaking(null); return; }
    setSpeaking(scene.id);
    try {
      // Thử gọi backend TTS (ElevenLabs/Google/OpenAI) — nếu chưa có key sẽ throw và fallback
      const { audioUrl } = await callTTS(scene.narration, project.config.voice);
      const audio = new Audio(audioUrl);
      toast("Đang phát giọng đọc AI (ElevenLabs/Google)...","info");
      await audio.play();
      audio.onended = () => setSpeaking(null);
      audio.onerror = async () => {
        // Fallback Web Speech
        const { speakWithWebSpeech } = await import("@/lib/api");
        await speakWithWebSpeech(scene.narration, project.config.voice);
        setSpeaking(null);
      };
    } catch (e: any) {
      toast(e.message || "Chưa có TTS key — dùng Web Speech fallback","info");
      const { speakWithWebSpeech } = await import("@/lib/api");
      await speakWithWebSpeech(scene.narration, project.config.voice);
      setSpeaking(null);
    }
  };

  const duplicateScene = (sceneId: string) => {
    const sc = project.scenes.find(s=>s.id===sceneId);
    if (!sc) return;
    addScene(project.id, { ...sc, title: sc.title + " (copy)" });
    toast("Đã nhân bản cảnh","success");
  };

  return (
    <div className="space-y-6">
      <StudioSteps projectId={project.id} current={4} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Storyboard — {project.title} <Badge tone="purple">Bản chính thức</Badge></h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowAdd(true)}><Plus size={16} className="mr-1" /> Thêm cảnh</Button>
          <Button onClick={genAll} className="shadow-md"><Wand2 size={16} className="mr-2" /> Tạo tất cả ({project.scenes.length})</Button>
        </div>
      </div>

      <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm flex items-center gap-3"><span><b>{project.scenes.length}</b> cảnh</span><span className="w-1 h-1 bg-gray-300 rounded-full" /><span>Tổng ~ {project.scenes.reduce((a, b) => a + b.duration, 0)}s</span><span className="w-1 h-1 bg-gray-300 rounded-full" /><span>{project.config.aspectRatio}</span><Badge tone="purple">{project.config.visualStyle}</Badge></div>
        <Button onClick={() => { useStore.getState().updateProject(project.id, { status: "editing" }); toast("Đã lưu storyboard","success"); setTimeout(()=> router.push(`/projects/${project.id}/studio`), 500); }} className="shadow-sm">Tiếp tục tới Studio →</Button>
      </Card>

      <div className="space-y-3">
        <AnimatePresence>
          {project.scenes.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
              <Card className="p-4 hover:shadow-md transition">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5BFF] to-[#A78BFA] text-white grid place-items-center text-xs font-bold shadow-sm">{s.index}</div>
                    <GripVertical size={16} className="text-gray-300" />
                    <span className="text-[10px] text-gray-400">{s.duration}s</span>
                  </div>

                  <div className="relative shrink-0 group cursor-pointer" onClick={()=>s.imageUrl && setPreviewImg(s.imageUrl)}>
                    <img src={s.thumbnail} alt="" className="w-[180px] h-[102px] rounded-xl object-cover border border-[#E9ECF5] bg-gray-100 group-hover:brightness-90 transition" />
                    <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Eye size={16} className="text-white" />
                    </div>
                    {s.status === "generating" && <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
                    {s.status === "done" && <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓ DONE</div>}
                    {s.status === "error" && <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">ERROR</div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Input value={s.title} onChange={(e:any) => updateScene(project.id, s.id, { title: e.target.value })} className="font-medium text-sm h-8 flex-1" placeholder="Tiêu đề cảnh" />
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-50 border shrink-0">{s.duration}s</span>
                      <Badge tone={s.status === "done" ? "green" : s.status === "generating" ? "orange" : s.status === "error" ? "red" : "gray"} dot>{s.status === "done" ? "Đã tạo" : s.status === "generating" ? "Đang tạo..." : s.status === "error" ? "Lỗi" : "Chờ"}</Badge>
                    </div>
                    {s.status === "generating" && <div className="mt-2"><Progress value={s.progress || 0} /></div>}
                    <div className="mt-3 grid lg:grid-cols-2 gap-3">
                      <div>
                        <Label>Lời dẫn (→ /api/ai/tts)</Label>
                        <Textarea value={s.narration} onChange={(e:any) => updateScene(project.id, s.id, { narration: e.target.value })} rows={2} placeholder="Nhập lời dẫn..." />
                        <button onClick={()=>handleSpeak(s)} className={`mt-1 text-xs flex items-center gap-1 px-2 py-1 rounded-full border transition ${speaking===s.id ? "bg-red-50 border-red-200 text-red-600" : "bg-white hover:bg-gray-50"}`}>
                          <Volume2 size={12} /> {speaking===s.id ? "Dừng" : "Nghe thử (gọi /api/ai/tts)"} • {s.narration.length} ký tự
                        </button>
                      </div>
                      <div>
                        <Label>Prompt tạo hình ảnh (→ /api/ai/generate-image)</Label>
                        <Textarea value={s.visualPrompt} onChange={(e:any) => updateScene(project.id, s.id, { visualPrompt: e.target.value })} rows={2} placeholder="Mô tả hình ảnh chi tiết..." />
                        <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1"><ImageIcon size={10} /> Backend sẽ dùng DALL·E 3 / SDXL / Pollinations — key ở server</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div><Label>Camera</Label><Input value={s.camera} onChange={(e:any) => updateScene(project.id, s.id, { camera: e.target.value })} /></div>
                      <div><Label>Prompt video</Label><Input value={s.videoPrompt} onChange={(e:any) => updateScene(project.id, s.id, { videoPrompt: e.target.value })} /></div>
                      <div><Label>Chuyển cảnh</Label><Select value={s.transition} onChange={(e:any) => updateScene(project.id, s.id, { transition: e.target.value })}><option>Fade</option><option>Cut</option><option>Slide</option><option>Zoom</option></Select></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button size="sm" onClick={() => genOne(s.id)} disabled={s.status === "generating"} className="shadow-sm"><RefreshCw size={14} className={`mr-1 ${s.status==="generating" ? "animate-spin" : ""}`} />{s.status === "done" ? "Tạo lại" : "Tạo"}</Button>
                    <Button size="sm" variant="ghost" onClick={() => duplicateScene(s.id)}><Copy size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => { if(confirm("Xóa cảnh này?")) { removeScene(project.id, s.id); toast("Đã xóa","success"); } }} className="text-red-600 hover:bg-red-50"><Trash2 size={14} /></Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {project.scenes.length === 0 && <Card className="p-10 text-center text-sm text-gray-500">Chưa có cảnh. <button onClick={()=> router.push(`/projects/${project.id}/setup`)} className="text-[#7C5BFF] underline">Tạo kịch bản trước</button> hoặc nhấn Thêm cảnh.</Card>}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Thêm cảnh mới" size="md">
        <div className="space-y-3">
          <div><Label required>Tiêu đề</Label><Input value={newScene.title} onChange={(e:any)=>setNewScene({...newScene, title: e.target.value})} placeholder="Ví dụ: Kết luận" /></div>
          <div><Label>Thời lượng (giây)</Label><Select value={newScene.duration} onChange={(e:any)=>setNewScene({...newScene, duration: Number(e.target.value)})}><option value={8}>8s</option><option value={10}>10s</option><option value={15}>15s</option><option value={18}>18s</option></Select></div>
          <div><Label>Lời dẫn</Label><Textarea value={newScene.narration} onChange={(e:any)=>setNewScene({...newScene, narration: e.target.value})} rows={2} placeholder="Nhập lời dẫn..." /></div>
          <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setShowAdd(false)}>Hủy</Button><Button onClick={()=>{ if(!newScene.title) { toast("Nhập tiêu đề","error"); return; } addScene(project.id, { ...newScene, visualPrompt: `Scene about ${newScene.title}`, videoPrompt: "slow pan", camera: "Trung cảnh", transition: "Fade" }); setShowAdd(false); setNewScene({ title: "", duration: 10, narration: "" }); toast("Đã thêm cảnh","success"); }}><Plus size={14} className="mr-1" /> Thêm</Button></div>
        </div>
      </Modal>

      <Modal open={!!previewImg} onClose={()=>setPreviewImg(null)} title="Xem ảnh cảnh" size="lg">
        {previewImg && <img src={previewImg} alt="" className="w-full rounded-xl" />}
        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setPreviewImg(null)}>Đóng</Button><Button onClick={()=>{ if(previewImg) { navigator.clipboard.writeText(previewImg); toast("Đã copy link","success"); } }}>Copy link</Button></div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
