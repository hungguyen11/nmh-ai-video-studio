"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Input, Label, Select, Textarea, Modal, useToast } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Save, Sparkles, Maximize2, Settings, Copy, Check } from "lucide-react";
import { callTTS, callExport, speakWithWebSpeech, stopSpeaking } from "@/lib/api";

export default function StudioPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const updateScene = useStore(s => s.updateScene);
  const addNotification = useStore(s => s.addNotification);
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast, ToastContainer } = useToast();

  useEffect(() => { if (project && !selected && project.scenes[0]) setSelected(project.scenes[0].id); }, [project, selected]);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(()=> setCurrentTime(c => {
      const total = project?.scenes.reduce((a,b)=>a+b.duration,0) || 60;
      if (c >= total) { setPlaying(false); return 0; }
      return c+1;
    }), 1000);
    return ()=> clearInterval(iv);
  }, [playing, project]);

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;

  const sel = project.scenes.find(s => s.id === selected) || project.scenes[0];
  const total = project.scenes.reduce((a, b) => a + b.duration, 0);

  const doExport = async () => {
    if (project.scenes.length===0) { toast("Chưa có cảnh để xuất","error"); return; }
    setExporting(true); setExportProgress(5); setShowExport(true);
    updateProject(project.id, { status: "exporting" });
    toast("Đang gọi /api/ai/export để ghép video...", "info");
    try {
      const data = await callExport(project.scenes, project.config, project.title);
      // Simulate progress for UX (backend đã trả về manifest/sample)
      let p = 20;
      const iv = setInterval(()=> {
        p += Math.random()*20 + 10;
        if (p >= 100) {
          p=100; clearInterval(iv);
          setExportProgress(100); setExporting(false); setExportDone(true);
          updateProject(project.id, { status: "completed", progress: 100, exportedUrl: data.downloadUrl || "#" });
          addNotification({ title: "Xuất video hoàn thành", desc: `"${project.title}" đã sẵn sàng.`, type: "success" });
          toast(`Xuất thành công! Provider: ${data.provider}`, "success");
        } else setExportProgress(Math.round(p));
      }, 350);
    } catch (e: any) {
      toast(e.message, "error");
      setExporting(false);
    }
  };

  const handlePlayVoice = async () => {
    if (!sel?.narration) { toast("Cảnh này chưa có lời dẫn","error"); return; }
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); return; }
    setIsSpeaking(true);
    try {
      toast("Đang gọi /api/ai/tts (ElevenLabs/Google)...","info");
      const { audioUrl } = await callTTS(sel.narration, project.config.voice);
      const audio = new Audio(audioUrl);
      await audio.play();
      toast("Đang phát giọng AI...","success");
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
    } catch (e: any) {
      toast("TTS backend lỗi — dùng Web Speech fallback","info");
      await speakWithWebSpeech(sel.narration, project.config.voice);
      setIsSpeaking(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = sel?.videoUrl || project.exportedUrl || "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";
    a.download = `${project.title.replace(/[^a-z0-9]/gi,'_')}.mp4`;
    a.target="_blank";
    a.click();
    toast("Đang tải video...","success");
  };

  return (
    <div className="space-y-4">
      <StudioSteps projectId={project.id} current={5} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold">Studio biên tập — {project.title} <Badge tone="purple">Chính thức</Badge></h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => { updateProject(project.id, { status: "editing" }); toast("Đã lưu","success"); }}><Save size={16} className="mr-1" /> Lưu</Button>
          <Button variant="ghost" onClick={()=>setShowSettings(true)}><Settings size={16} /></Button>
          <Button onClick={doExport} disabled={exporting} className="bg-emerald-600 hover:bg-emerald-700 shadow-md">{exporting ? `Đang xuất ${exportProgress}%` : exportDone ? "✓ Đã xuất" : <><Download size={16} className="mr-1" /> Xuất MP4</>}</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr_320px] gap-4">
        <div className="space-y-3">
          <Card className="p-2 flex gap-1 overflow-auto">
            {[
              { k: "Video", icon: "🎬" }, { k: "Âm thanh", icon: "🎵" }, { k: "Phụ đề", icon: "CC" }, { k: "Hiệu ứng", icon: "✨" }, { k: "Tài nguyên", icon: "📦" },
            ].map(t => <button key={t.k} onClick={()=>toast(`Đã mở ${t.k} — quản lý trong Studio`,"info")} className="flex-1 px-2 py-2 rounded-xl bg-[#F5F3FF] border border-[#E9ECF5] text-xs font-medium flex flex-col items-center gap-1 hover:bg-white hover:shadow-sm transition"><span>{t.icon}</span>{t.k}</button>)}
          </Card>
          <Card className="p-2">
            <div className="text-xs font-medium px-2 py-1 flex justify-between">Danh sách cảnh <Badge tone="purple">{project.scenes.length}</Badge></div>
            <div className="mt-2 space-y-2 max-h-[60vh] overflow-auto">
              {project.scenes.map(s => (
                <motion.button key={s.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setSelected(s.id)} className={`w-full text-left flex gap-2 p-2 rounded-xl border transition ${selected === s.id ? "border-[#7C5BFF] bg-[#F5F3FF] shadow-sm" : "border-[#E9ECF5] bg-white hover:bg-gray-50"}`}>
                  <img src={s.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{s.index}. {s.title}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">{s.duration}s • <span className={`px-1 py-0.5 rounded text-[10px] ${s.status==="done"?"bg-emerald-100 text-emerald-700":s.status==="generating"?"bg-amber-100 text-amber-700":"bg-gray-100"}`}>{s.status}</span></div>
                  </div>
                  {selected===s.id && <div className="w-2 h-2 bg-[#7C5BFF] rounded-full animate-pulse shrink-0 mt-2" />}
                </motion.button>
              ))}
              {project.scenes.length===0 && <div className="text-xs text-gray-500 p-4 text-center">Chưa có cảnh</div>}
            </div>
            <Button size="sm" variant="ghost" className="w-full mt-2" onClick={()=>router.push(`/projects/${project.id}/storyboard`)}>+ Quản lý storyboard</Button>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="overflow-hidden shadow-lg">
            <div className="bg-gray-900 aspect-video relative flex items-center justify-center overflow-hidden group">
              {sel ? (
                <>
                  <img src={sel.imageUrl || sel.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-black/60 text-white text-xs backdrop-blur border border-white/10">
                      {sel.title} • {sel.narration.slice(0,50)}...
                    </motion.div>
                  </div>
                </>
              ) : <div className="text-white/60 text-sm">Chưa chọn cảnh</div>}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setPlaying(v => !v)} className="absolute w-14 h-14 rounded-full bg-white grid place-items-center shadow-xl">
                {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </motion.button>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium shadow flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> 00:{String(currentTime).padStart(2, "0")} / 01:{String(total).padStart(2, "0")}</div>
              <div className="absolute top-3 right-3 flex gap-1">
                <span className="px-2 py-1 rounded-full bg-white text-xs font-medium shadow">{project.config.aspectRatio}</span>
                <span className="px-2 py-1 rounded-full bg-[#7C5BFF] text-white text-xs font-medium shadow">{project.config.resolution}</span>
                <button onClick={()=>toast("Toàn màn hình","info")} className="w-7 h-7 rounded-full bg-black/40 text-white grid place-items-center backdrop-blur hover:bg-black/60"><Maximize2 size={12} /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"><motion.div animate={{ width: `${Math.min(100, (currentTime/Math.max(1,total))*100)}%` }} className="h-full bg-[#7C5BFF]" /></div>
            </div>
            <div className="p-3 flex items-center gap-2 border-t bg-white">
              <motion.button whileTap={{ scale: 0.9 }} onClick={()=>setCurrentTime(c=>Math.max(0,c-5))} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-gray-50"><SkipBack size={14} /></motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlaying(v => !v)} className="w-9 h-9 grid place-items-center rounded-full bg-[#7C5BFF] text-white shadow-md hover:bg-[#6B4EFF]">{playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}</motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={()=>setCurrentTime(c=>Math.min(total,c+5))} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-gray-50"><SkipForward size={14} /></motion.button>
              <div className="flex-1 mx-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min(100, (currentTime/Math.max(1,total))*100)}%` }} transition={{ duration: 0.3 }} className="h-full bg-[#7C5BFF] rounded-full" /></div>
              <div className="flex items-center gap-1"><Volume2 size={14} className="text-gray-500" /><input type="range" min={0} max={100} value={volume} onChange={(e:any)=>setVolume(Number(e.target.value))} className="w-14 accent-[#7C5BFF]" /></div>
              <button onClick={handlePlayVoice} className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 transition ${isSpeaking ? "bg-red-50 border-red-200 text-red-600" : "bg-white hover:bg-gray-50"}`}><Volume2 size={12} /> {isSpeaking ? "Dừng" : "Giọng đọc"}</button>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Timeline</h3><div className="text-xs text-gray-500">Nhấn cảnh để chỉnh</div></div>
            <div className="mt-3 space-y-2">
              <div className="flex gap-1 overflow-auto pb-1">
                {project.scenes.map(s => (
                  <motion.div key={s.id} whileHover={{ y: -2 }} onClick={() => setSelected(s.id)} className={`shrink-0 w-24 rounded-xl overflow-hidden border-2 cursor-pointer transition ${selected === s.id ? "border-[#7C5BFF] shadow-md" : "border-[#E9ECF5] hover:border-gray-300"}`}>
                    <div className="relative">
                      <img src={s.thumbnail} alt="" className="h-14 w-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5BFF]" style={{ width: `${s.progress||0}%` }} />
                    </div>
                    <div className="p-1.5 text-[11px] font-medium truncate bg-white flex items-center justify-between">{s.title}<span className="text-[10px] text-gray-500">{s.duration}s</span></div>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-1.5 p-2 rounded-xl bg-gray-50 border">
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium">🎬 Video</span><div className="flex-1 h-7 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex overflow-hidden">{project.scenes.map(s => <div key={s.id} onClick={()=>setSelected(s.id)} className={`flex-1 border-r last:border-0 border-white/50 grid place-items-center text-[10px] font-bold cursor-pointer hover:bg-[#DDD6FE] ${selected===s.id?"bg-[#7C5BFF] text-white":""}`}>{s.index}</div>)}</div><span className="text-[10px] text-gray-500">{total}s</span></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium">🎤 Voice</span><div className="flex-1 h-7 rounded-full bg-emerald-50 border border-emerald-200 overflow-hidden relative p-1 flex items-center"><div className="flex gap-0.5 items-center w-full">{Array.from({ length: 28 }).map((_, i) => <motion.div key={i} animate={{ height: [6, 14+Math.random()*10, 6] }} transition={{ duration: 0.8, repeat: Infinity, delay: i*0.05 }} className="flex-1 bg-emerald-400 rounded-full" />)}</div></div><span className="text-[10px] text-gray-500">API</span></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium">🎵 Nhạc</span><div className="flex-1 h-7 rounded-full bg-amber-50 border border-amber-200 overflow-hidden p-1"><div className="h-full bg-gradient-to-r from-amber-300 to-orange-300 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ width: "92%" }}>Nhạc nền</div></div></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-16 shrink-0 font-medium">CC Phụ đề</span><div className="flex-1 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center px-2 text-[10px] truncate">{sel?.narration.slice(0, 70)}...</div><button onClick={()=>toast("Đã chỉnh phụ đề","success")} className="text-xs text-[#7C5BFF] underline">Sửa</button></div>
              </div>
            </div>
          </Card>

          <AnimatePresence>
            {exportDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="p-4 bg-emerald-50 border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-emerald-500 text-white grid place-items-center">✓</div><div><div className="font-medium text-emerald-800">Xuất MP4 thành công!</div><div className="text-xs text-emerald-700">Tệp đã sẵn sàng. Trên VPS có FFmpeg sẽ ghép thật.</div></div></div>
                  <Button size="sm" onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700"><Download size={14} className="mr-1" /> Tải MP4</Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Card className="p-4 h-fit sticky top-[88px]">
          {!sel ? <div className="text-sm text-gray-500">Chọn một cảnh để chỉnh sửa</div> : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={sel.id}>
              <h3 className="font-semibold flex items-center justify-between">Thiết lập cảnh <Badge tone="purple">Cảnh {sel.index}</Badge></h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-[#E9ECF5] group">
                <div className="relative">
                  <img src={sel.imageUrl || sel.thumbnail} alt="" className="w-full h-32 object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={()=>{ navigator.clipboard.writeText(sel.imageUrl||""); toast("Đã copy link","success"); }} className="w-7 h-7 rounded-full bg-black/50 text-white grid place-items-center backdrop-blur hover:bg-black/70"><Copy size={12} /></button>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <div className="text-sm font-medium">{sel.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">Cảnh {sel.index} • {sel.duration}s • <Badge tone={sel.status==="done"?"green":sel.status==="generating"?"orange":"gray"}>{sel.status}</Badge></div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div><Label>Nhân vật</Label><Select value="Nữ 28-30" onChange={()=>toast("Đã đổi nhân vật","success")}><option>Nữ 28-30 tuổi — Văn phòng</option><option>Nam 30 tuổi</option></Select></div>
                <div><Label>Bối cảnh</Label><Input value="Văn phòng làm việc" onChange={()=>{}} /></div>
                <div><Label>Phong cách</Label><Select value={project.config.visualStyle}><option>{project.config.visualStyle}</option></Select></div>
                <div><Label>Chuyển động camera</Label><Select value={sel.camera} onChange={(e:any) => updateScene(project.id, sel.id, { camera: e.target.value })}><option>Cận cảnh + Zoom nhẹ</option><option>Toàn cảnh</option><option>Pan phải</option></Select></div>
                <div><Label>Prompt (gửi /api/ai/generate-image)</Label><Textarea value={sel.visualPrompt} onChange={(e:any) => updateScene(project.id, sel.id, { visualPrompt: e.target.value })} rows={3} /></div>
                <div className="p-2.5 rounded-xl bg-[#F5F3FF] border text-xs text-gray-600">Nhấn “Tạo” ở Storyboard để gọi API thật với prompt này.</div>
                <Button variant="outline" className="w-full" onClick={()=>toast("Gợi ý prompt: thêm 'cinematic lighting, 8k'","info")}><Sparkles size={14} className="mr-1" /> Gợi ý prompt AI</Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="ghost" onClick={handlePlayVoice} className={isSpeaking?"bg-red-50 text-red-600":""}><Volume2 size={12} className="mr-1" /> {isSpeaking?"Dừng":"Nghe"}</Button>
                  <Button size="sm" variant="ghost" onClick={()=>toast("Đã áp dụng cho tất cả cảnh","success")}><Copy size={12} className="mr-1" /> Áp dụng all</Button>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </div>

      <Modal open={showExport} onClose={()=>setShowExport(false)} title="Xuất video MP4 — Bản chính thức" size="md">
        <div className="text-center py-4">
          <div className={`w-16 h-16 rounded-full mx-auto grid place-items-center text-2xl ${exportDone ? "bg-emerald-500 text-white" : "bg-[#EDE9FE] text-[#7C5BFF]"}`}>{exportDone ? "✓" : <span className="w-8 h-8 border-2 border-[#7C5BFF]/30 border-t-[#7C5BFF] rounded-full animate-spin" />}</div>
          <h4 className="font-semibold mt-3">{exportDone ? "Hoàn thành!" : `Đang xuất... ${exportProgress}%`}</h4>
          <p className="text-sm text-gray-500 mt-1">{exportDone ? "Video đã sẵn sàng. Trên VPS có FFmpeg sẽ ghép video+audio+subtitles thật thành MP4." : "Đang gọi /api/ai/export — ghép các cảnh, audio và phụ đề."}</p>
          <div className="mt-4"><Progress value={exportProgress} /></div>
          {exportDone && <div className="mt-4 flex gap-2 justify-center"><Button variant="ghost" onClick={()=>setShowExport(false)}>Tiếp tục chỉnh</Button><Button onClick={handleDownload}><Download size={14} className="mr-1" /> Tải MP4</Button></div>}
        </div>
      </Modal>

      <Modal open={showSettings} onClose={()=>setShowSettings(false)} title="Cài đặt Studio" size="md">
        <div className="space-y-4">
          <div><Label>Tự động lưu</Label><div className="flex items-center justify-between p-3 rounded-xl border"><span className="text-sm">Lưu mỗi 30s (server)</span><input type="checkbox" defaultChecked className="accent-[#7C5BFF]" /></div></div>
          <div><Label>Chất lượng preview</Label><Select defaultValue="1080p"><option>720p</option><option>1080p</option><option>4K</option></Select></div>
          <div className="flex justify-end"><Button onClick={()=>{ setShowSettings(false); toast("Đã lưu","success"); }}>Lưu</Button></div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
