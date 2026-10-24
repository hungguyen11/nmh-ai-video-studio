"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Label, Select, Badge, Modal, useToast } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Info } from "lucide-react";
import { callGenerateScript } from "@/lib/api";
import { enrichScenesWithThumbs } from "@/lib/mockAI";

const contentStyles = [
  { id: "Documentary", desc: "Giải thích, giáo dục" },
  { id: "Animation", desc: "Hoạt hình vui nhộn" },
  { id: "POV", desc: "Góc nhìn thứ nhất" },
  { id: "Motion Graphics", desc: "Infographic động" },
  { id: "Cinematic", desc: "Điện ảnh, hùng tráng" },
  { id: "Storytelling", desc: "Kể chuyện cảm xúc" },
] as const;
const visualStyles = [
  { id: "3D Cute", label: "Hoạt hình 3D dễ thương", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200" },
  { id: "2D Animation", label: "Hoạt hình 2D", thumb: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200" },
  { id: "Photorealistic", label: "Người thật", thumb: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200" },
  { id: "3D Semi-real", label: "3D bán chân thực", thumb: "https://images.unsplash.com/photo-1578632292335-df3ab3100d00?w=200" },
  { id: "Vector", label: "Vector / Flat", thumb: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200" },
  { id: "Stop Motion", label: "Stop Motion", thumb: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200" },
  { id: "Pastel 2.5D", label: "Pastel 2.5D Kinetic", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200" },
];

export default function SetupPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const [ratio, setRatio] = useState(project?.config.aspectRatio || "16:9");
  const [duration, setDuration] = useState(project?.config.duration || 1);
  const [resolution, setResolution] = useState(project?.config.resolution || "1080p");
  const [previewStyle, setPreviewStyle] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const { toast, ToastContainer } = useToast();

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án <a href="/dashboard" className="text-[#7C5BFF] underline">Về dashboard</a></div>;

  const setContentStyle = (v: any) => { updateProject(project.id, { config: { ...project.config, contentStyle: v } }); toast(`Đã chọn: ${v}`, "success"); };
  const setVisualStyle = (v: any) => { updateProject(project.id, { config: { ...project.config, visualStyle: v } }); toast(`Đã chọn: ${v}`, "success"); };

  const generateScript = async () => {
    setLoading(true);
    toast("Đang gọi Google Gemini / OpenAI để tạo kịch bản...", "info");
    try {
      const data = await callGenerateScript(project.topic, { contentStyle: project.config.contentStyle, visualStyle: project.config.visualStyle, language: project.config.language });
      // data có { objective, scenesOutline, fullScript, scenes }
      const scenes = enrichScenesWithThumbs(data.scenes || []);
      updateProject(project.id, {
        script: { objective: data.objective, scenesOutline: data.scenesOutline, fullScript: data.fullScript },
        scenes,
        status: "storyboard",
        progress: 35,
        config: { ...project.config, aspectRatio: ratio as any, duration, resolution: resolution as any },
      });
      toast(`Đã tạo kịch bản bằng ${data.provider} — ${scenes.length} cảnh!`, "success");
      setTimeout(()=> router.push(`/projects/${project.id}/script`), 600);
    } catch (e: any) {
      toast(e.message || "Lỗi tạo kịch bản", "error");
      // Nếu thiếu key, hướng dẫn
      if (e.message?.includes("API key") || e.message?.includes("Cấu hình")) {
        setTimeout(()=> router.push("/settings"), 1500);
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Thiết lập video — Bản chính thức</h1>
        <p className="text-sm text-gray-500">Chọn phong cách, tỉ lệ và thông số. Gọi API thật qua backend — key không lộ ra frontend.</p>
      </div>

      <StudioSteps projectId={project.id} current={2} />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <Card className="p-5">
          <h3 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-[#7C5BFF]" /> Phong cách nội dung</h3>
          <p className="text-xs text-gray-500">Gửi kèm vào prompt gọi Gemini/OpenAI</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {contentStyles.map(s => (
              <motion.button key={s.id} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setContentStyle(s.id)} className={`p-3 rounded-2xl border text-left transition ${project.config.contentStyle === s.id ? "border-[#7C5BFF] bg-[#F5F3FF] shadow-sm" : "border-[#E9ECF5] bg-white hover:bg-gray-50"}`}>
                <div className={`w-8 h-8 rounded-xl grid place-items-center text-sm font-bold ${project.config.contentStyle===s.id ? "bg-[#7C5BFF] text-white" : "bg-[#EDE9FE] text-[#7C5BFF]"}`}>◈</div>
                <div className="text-sm font-medium mt-2 flex items-center gap-1">{s.id} {project.config.contentStyle===s.id && <Check size={12} className="text-[#7C5BFF]" />}</div>
                <div className="text-[11px] text-gray-500">{s.desc}</div>
              </motion.button>
            ))}
          </div>

          <h3 className="font-semibold mt-6 flex items-center gap-2">Phong cách hình ảnh <Badge tone="purple">7 lựa chọn → truyền vào prompt ảnh</Badge></h3>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {visualStyles.map(v => (
              <motion.button key={v.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setVisualStyle(v.id)} className={`rounded-2xl overflow-hidden border-2 text-left bg-white transition ${project.config.visualStyle === v.id ? "border-[#7C5BFF] ring-4 ring-[#7C5BFF]/15 shadow-md" : "border-[#E9ECF5] hover:border-gray-300 hover:shadow-sm"}`}>
                <div className="relative">
                  <img src={v.thumb} alt="" className="h-16 w-full object-cover" />
                  {project.config.visualStyle===v.id && <div className="absolute top-1 right-1 w-5 h-5 bg-[#7C5BFF] text-white rounded-full grid place-items-center"><Check size={12} /></div>}
                  <button onClick={(e)=>{ e.stopPropagation(); setPreviewStyle(v.id); }} className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur">Xem</button>
                </div>
                <div className="p-2 text-[11px] font-medium leading-tight">{v.label}</div>
              </motion.button>
            ))}
          </div>
        </Card>

        <Card className="p-5 h-fit sticky top-[88px]">
          <h3 className="font-semibold">Thông số video</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Tỉ lệ khung hình</Label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {[{r:"16:9",d:"Ngang"}, {r:"9:16",d:"Dọc"}, {r:"1:1",d:"Vuông"}].map(o => (
                  <button key={o.r} onClick={() => { setRatio(o.r as any); toast(`Tỉ lệ ${o.r}`,"success"); }} className={`py-2.5 rounded-xl border text-sm font-medium transition ${ratio === o.r ? "bg-[#7C5BFF] text-white border-[#7C5BFF] shadow-md" : "bg-white border-[#E9ECF5] hover:bg-gray-50"}`}>{o.r} <span className="text-xs opacity-70">{o.d}</span></button>
                ))}
              </div>
              <div className="mt-2 p-2 rounded-xl bg-gray-50 border text-xs text-gray-600 flex items-center gap-2"><Info size={14} /> Preview tự đổi khung hình theo tỉ lệ.</div>
            </div>
            <div>
              <Label>Thời lượng</Label>
              <Select value={duration} onChange={(e:any)=>{ setDuration(Number(e.target.value)); toast("Đã đổi thời lượng","success"); }}>
                <option value={1}>1 phút (5 cảnh)</option>
                <option value={2}>1.5 - 2 phút (7 cảnh)</option>
                <option value={3}>2-3 phút (9 cảnh)</option>
              </Select>
            </div>
            <div>
              <Label>Độ phân giải</Label>
              <Select value={resolution} onChange={(e:any)=>{ setResolution(e.target.value); toast("Đã đổi độ phân giải","success"); }}>
                <option value="720p">720p (HD) — Nhanh</option>
                <option value="1080p">1080p (Full HD) — Khuyên dùng</option>
                <option value="4K">4K — Pro / Business</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Ngôn ngữ</Label><Select defaultValue="vi-VN"><option>Tiếng Việt (vi-VN)</option><option>English (en-US)</option><option>日本語</option></Select></div>
              <div><Label>Giọng đọc</Label><Select defaultValue="female-warm"><option>Nữ ấm áp (ElevenLabs)</option><option>Nam trầm</option><option>Google Wavenet</option></Select></div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFF] border border-[#E9ECF5] cursor-pointer hover:bg-white transition">
                <span className="text-sm font-medium">🎵 Nhạc nền</span><span className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-white">Bật</span><input type="checkbox" defaultChecked className="accent-[#7C5BFF] w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFF] border border-[#E9ECF5]">
                <span className="text-sm font-medium">CC Phụ đề (Whisper)</span><span className="text-xs px-2 py-1 rounded-full bg-[#7C5BFF] text-white">Bật</span><input type="checkbox" defaultChecked className="accent-[#7C5BFF] w-4 h-4" />
              </label>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex gap-2"><Info size={14} className="shrink-0 mt-0.5" /> <span><b>Bản chính thức:</b> Nhấn “Tạo kịch bản AI” sẽ gọi <b>/api/ai/generate-script</b> → Google Gemini (ưu tiên) hoặc OpenAI. Key được đọc từ <code>.env.local</code> ở server, không lộ ra trình duyệt.</span></div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => router.push("/dashboard")}>Quay lại</Button>
            <Button className="flex-1 shadow-md" loading={loading} onClick={generateScript}><Sparkles size={14} className="mr-2" /> Tạo kịch bản AI →</Button>
          </div>
          <div className="mt-3 text-center"><button onClick={()=>toast("Đã lưu nháp","success")} className="text-xs text-gray-500 hover:text-[#7C5BFF] underline">Lưu nháp và tiếp tục sau</button></div>
        </Card>
      </div>

      <Modal open={!!previewStyle} onClose={()=>setPreviewStyle(null)} title={`Phong cách: ${previewStyle}`} size="lg">
        <img src={visualStyles.find(v=>v.id===previewStyle)?.thumb} alt="" className="w-full h-64 object-cover rounded-xl" />
        <p className="text-sm text-gray-600 mt-3">Ví dụ minh họa cho phong cách <b>{previewStyle}</b>. Khi tạo thật, prompt ảnh sẽ chứa style này cho mọi cảnh.</p>
        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setPreviewStyle(null)}>Đóng</Button><Button onClick={()=>{ if(previewStyle) setVisualStyle(previewStyle); setPreviewStyle(null); }}>Chọn phong cách này</Button></div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
