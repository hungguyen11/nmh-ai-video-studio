"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge, Modal, useToast } from "@/components/ui";
import { ArrowRight, Play, Sparkles, Layers, Mic, Subtitles, Wand2, Clock, Shield, Zap, Check, Star, Users, Video } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const createProject = useStore(s => s.createProject);
  const { toast, ToastContainer } = useToast();

  const onCreate = () => {
    if (!topic.trim()) { toast("Vui lòng nhập chủ đề video", "error"); return; }
    const id = createProject(topic.trim());
    toast("Đã tạo dự án! Đang chuyển tới thiết lập...", "success");
    setTimeout(()=> router.push(`/projects/${id}/setup`), 600);
  };

  return (
    <div className="bg-[#F6F7FB] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5BFF] to-[#A78BFA] grid place-items-center text-white font-bold shadow-md">M</motion.div>
            <span className="font-semibold">NMH AI Video Studio</span>
            <span className="hidden md:inline-flex ml-4 gap-6 text-sm text-gray-600">
              <Link href="#features" className="hover:text-[#7C5BFF] transition">Tính năng</Link>
              <Link href="/billing" className="hover:text-[#7C5BFF] transition">Bảng giá</Link>
              <Link href="/dashboard" className="hover:text-[#7C5BFF] transition">Dashboard</Link>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white border border-transparent hover:border-[#E9ECF5] hover:shadow-sm transition">Đăng nhập</Link>
            <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-medium bg-[#7C5BFF] text-white hover:bg-[#6B4EFF] hover:shadow-md hover:-translate-y-px transition">Đăng ký</Link>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center py-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E9ECF5] text-xs font-medium text-gray-600 shadow-sm">
              <Sparkles size={14} className="text-[#7C5BFF]" /> AI Video Studio mới — Tạo video trong vài phút <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] animate-pulse">LIVE</span>
            </motion.div>
            <h1 className="mt-4 text-[44px] leading-[1.05] font-bold tracking-tight">Biến ý tưởng<br /><span className="bg-gradient-to-r from-[#7C5BFF] to-[#A78BFA] bg-clip-text text-transparent">thành video bằng AI</span></h1>
            <p className="mt-4 text-gray-600 max-w-xl leading-relaxed">Chỉ cần nhập chủ đề, AI sẽ tự động tạo kịch bản, phân cảnh, hình ảnh, giọng đọc và dựng thành video hoàn chỉnh. Hỗ trợ TikTok, YouTube Shorts, Reels.</p>

            <div className="mt-6 flex items-center gap-2 max-w-xl bg-white p-2 rounded-2xl border border-[#E9ECF5] shadow-sm hover:shadow-md transition">
              <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=> e.key==='Enter' && onCreate()} placeholder="Nhập chủ đề video của bạn..." className="flex-1 px-4 py-2 outline-none text-sm bg-transparent" />
              <Button onClick={onCreate} className="shrink-0 shadow-md hover:shadow-lg">Bắt đầu tạo video <ArrowRight size={16} className="ml-2" /></Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">Ví dụ: <button onClick={()=>setTopic("Giải thích vì sao máy tính Windows bị chậm và cách khắc phục trong 1 phút")} className="underline hover:text-[#7C5BFF]">"Giải thích vì sao máy tính Windows bị chậm..."</button></div>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-xl">
              {[
                { icon: Layers, title: "Đa dạng phong cách", desc: "Hoạt hình, thực tế, motion...", color: "bg-orange-50 text-orange-600" },
                { icon: Wand2, title: "Tự động hoàn toàn", desc: "Lập kịch bản - tạo cảnh - ghép video", color: "bg-emerald-50 text-emerald-600" },
                { icon: Zap, title: "Dễ sử dụng", desc: "Không cần kinh nghiệm dựng phim", color: "bg-blue-50 text-blue-600" },
                { icon: Clock, title: "Siêu nhanh", desc: "2-5 phút có video 1 phút", color: "bg-purple-50 text-purple-600" },
              ].map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i*0.05 }} className="bg-white border border-[#E9ECF5] rounded-2xl p-3 flex gap-3 hover:shadow-md hover:-translate-y-0.5 transition">
                  <div className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${f.color}`}><f.icon size={16} /></div>
                  <div><div className="text-sm font-medium">{f.title}</div><div className="text-xs text-gray-500">{f.desc}</div></div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Users size={14} /> 12k+ người dùng</span>
              <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> 4.9/5 (2.3k đánh giá)</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Bảo mật</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#DDD6FE] rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute -bottom-10 -left-6 w-56 h-56 bg-[#FFD6C8] rounded-full blur-3xl opacity-50" />
            <Card className="relative overflow-hidden p-3 hover:shadow-xl transition">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[16/10] group cursor-pointer" onClick={()=>setShowVideo(true)}>
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900" alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-14 h-14 rounded-full bg-white grid place-items-center shadow-xl">
                    <Play size={22} className="fill-gray-900 text-gray-900 ml-0.5" />
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur border border-white/10 flex items-center gap-1"><Video size={12} /> Video mẫu</span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-gray-900 text-xs font-medium shadow">00:12 / 01:30</span>
                </div>
              </div>
              <motion.div initial={{ rotate: 2 }} whileHover={{ rotate: 0, scale: 1.02 }} className="absolute -right-2 top-16 bg-white border border-[#E9ECF5] rounded-2xl px-3 py-2 shadow-card text-xs">
                <div className="font-medium flex items-center gap-1"><Sparkles size={12} className="text-[#7C5BFF]" /> Tự động</div><div className="text-gray-500">từ ý tưởng đến video thật<br />chỉ trong vài phút!</div>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} id="features">
          <Card className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-lg">Quy trình tạo video</h3>
              <Badge tone="purple">5 bước • 2-5 phút • Hoàn toàn tự động</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { n: 1, t: "Nhập ý tưởng", d: "Chủ đề, mô tả ngắn" },
                { n: 2, t: "AI viết kịch bản", d: "Lập dàn ý, phân cảnh" },
                { n: 3, t: "Duyệt storyboard", d: "Sửa cảnh, prompt" },
                { n: 4, t: "Tạo video", d: "Render từng cảnh + voice" },
                { n: 5, t: "Xuất MP4", d: "Tải về & chia sẻ" },
              ].map((s, i) => (
                <motion.div key={s.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.07 }} className="bg-[#F9FAFF] border border-[#E9ECF5] rounded-2xl p-4 hover:bg-white hover:shadow-md hover:-translate-y-1 transition text-center group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5BFF] to-[#A78BFA] text-white grid place-items-center text-sm font-bold mx-auto shadow-md group-hover:scale-110 transition">{s.n}</div>
                  <div className="text-sm font-medium mt-2">{s.t}</div>
                  <div className="text-xs text-gray-500">{s.d}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Hoạt hình 3D", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" },
                { label: "Người thật", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400" },
                { label: "Motion Graphics", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400" },
                { label: "Cinematic", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
              ].map(c => (
                <motion.div key={c.label} whileHover={{ y: -4 }} className="rounded-2xl overflow-hidden border border-[#E9ECF5] bg-white hover:shadow-lg transition cursor-pointer">
                  <img src={c.img} alt="" className="h-24 w-full object-cover" />
                  <div className="p-2.5 text-xs font-medium text-center flex items-center justify-center gap-1"><Check size={12} className="text-emerald-500" />{c.label}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <footer className="py-10 text-center text-xs text-gray-500">© 2026 NMH AI Video Studio • Demo mode hoạt động 100% • Không lưu API key ở frontend • <Link href="/dashboard" className="underline hover:text-[#7C5BFF]">Vào Studio →</Link></footer>
      </div>

      <Modal open={showVideo} onClose={()=>setShowVideo(false)} title="Video mẫu — Windows bị chậm" size="lg">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video controls autoPlay src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" className="w-full h-full" />
        </div>
        <p className="text-sm text-gray-600 mt-3">Đây là video demo được tạo bởi NMH AI Studio. Bản LIVE sẽ render từ storyboard của bạn.</p>
        <div className="flex gap-2 justify-end mt-4"><Button variant="ghost" onClick={()=>setShowVideo(false)}>Đóng</Button><Button onClick={()=>{ setShowVideo(false); const t="Giải thích vì sao máy tính Windows bị chậm và cách khắc phục"; const id=createProject(t); router.push(`/projects/${id}/setup`); }}>Tạo video tương tự</Button></div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
