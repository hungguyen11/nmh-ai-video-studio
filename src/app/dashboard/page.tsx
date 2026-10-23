"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Modal, Input, Label, useToast } from "@/components/ui";
import { Plus, Play, Clock, Search, MoreHorizontal, Copy, Trash2, Edit3, Eye, Download, Sparkles, Video, Image as ImageIcon, Mic, Type, Filter, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Dashboard() {
  const { projects, user, duplicateProject, deleteProject } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [preview, setPreview] = useState<string|null>(null);
  const [delId, setDelId] = useState<string|null>(null);
  const { toast, ToastContainer } = useToast();

  const filtered = projects.filter(p => {
    const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase());
    const matchF = filter==="all" || p.status===filter;
    return matchQ && matchF;
  });

  const stats = [
    { label: "Tổng dự án", value: projects.length, icon: Video, tone: "bg-[#EDE9FE] text-[#7C5BFF]" },
    { label: "Đang xử lý", value: projects.filter(p => p.status === "generating").length, icon: Sparkles, tone: "bg-amber-50 text-amber-600" },
    { label: "Hoàn thành", value: projects.filter(p => p.status === "completed").length, icon: Clock, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Bản nháp", value: projects.filter(p => p.status === "draft").length, icon: Edit3, tone: "bg-gray-50 text-gray-600" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold">Xin chào, {user?.name}! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Cùng tạo những video tuyệt vời hôm nay</p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects/new" className="inline-flex items-center gap-2 bg-[#7C5BFF] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4EFF] hover:shadow-md hover:-translate-y-px transition shadow-sm"><Plus size={16} /> Tạo dự án mới</Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i) => {
          const Icon = s.icon as any;
          return <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
            <Card className="p-4 flex items-center gap-3 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.tone}`}><Icon size={18} /></div>
              <div><div className="text-xs text-gray-500">{s.label}</div><div className="text-xl font-bold">{s.value}</div></div>
            </Card>
          </motion.div>;
        })}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">Dự án gần đây</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm dự án..." className="pl-8 pr-3 py-2 rounded-xl border border-[#E9ECF5] text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-[#7C5BFF]/20 focus:border-[#7C5BFF]" />
              </div>
              <select value={filter} onChange={e=>setFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E9ECF5] text-sm bg-white">
                <option value="all">Tất cả</option><option value="draft">Nháp</option><option value="editing">Đang sửa</option><option value="generating">Đang tạo</option><option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filtered.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-3 rounded-2xl border border-[#E9ECF5] hover:bg-gray-50 hover:border-gray-200 transition group">
                <div className="relative shrink-0 cursor-pointer" onClick={()=>setPreview(p.id)}>
                  <img src={p.scenes[0]?.thumbnail || "https://picsum.photos/seed/" + p.id + "/120/68"} alt="" className="w-[110px] h-[64px] rounded-xl object-cover bg-gray-100" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl grid place-items-center opacity-0 group-hover:opacity-100 transition"><Play size={16} className="text-white fill-white" /></div>
                  {p.status==="generating" && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse border-2 border-white" />}
                </div>
                <Link href={`/projects/${p.id}/studio`} className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate group-hover:text-[#7C5BFF] transition flex items-center gap-1">{p.title} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition" /></div>
                  <div className="text-xs text-gray-500 truncate">{p.topic}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 max-w-[200px]"><Progress value={p.progress} /></div>
                    <span className="text-xs text-gray-500 shrink-0">{p.progress}%</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">{p.scenes.length} cảnh • {p.config.aspectRatio}</span>
                  </div>
                </Link>
                <Badge tone={p.status === "completed" ? "green" : p.status === "generating" ? "orange" : p.status === "editing" ? "purple" : "gray"}>{p.status === "completed" ? "Hoàn thành" : p.status === "generating" ? "Đang tạo" : p.status === "editing" ? "Đang sửa" : "Nháp"}</Badge>
                <div className="hidden md:flex gap-1">
                  <button onClick={()=>{ const nid=duplicateProject(p.id); toast("Đã nhân bản dự án","success"); }} className="w-8 h-8 grid place-items-center rounded-xl border bg-white hover:bg-gray-50" title="Nhân bản"><Copy size={14} /></button>
                  <button onClick={()=>setDelId(p.id)} className="w-8 h-8 grid place-items-center rounded-xl border bg-white hover:bg-red-50 text-red-500" title="Xóa"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
            {filtered.length===0 && <div className="py-10 text-center text-sm text-gray-500">Không có dự án nào. <Link href="/projects/new" className="text-[#7C5BFF] underline">Tạo ngay</Link></div>}
          </div>
          {filtered.length>0 && <Link href="/projects" className="mt-4 inline-flex items-center gap-1 text-sm text-[#7C5BFF] font-medium hover:underline">Xem tất cả dự án <ArrowUpRight size={14} /></Link>}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-[#7C5BFF]" /> Trạng thái AI</h3>
            <div className="mt-3 space-y-2.5 text-sm">
              {[
                { label: "Tạo ảnh (Pollinations)", icon: ImageIcon, ok: true },
                { label: "Tạo video (Replicate/Luma)", icon: Video, ok: true },
                { label: "Giọng đọc (Web Speech + ElevenLabs)", icon: Mic, ok: true },
                { label: "Phụ đề (Whisper)", icon: Type, ok: true },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 transition">
                  <span className="flex items-center gap-2"><s.icon size={14} /> {s.label}</span>
                  <span className="text-emerald-700 font-medium text-xs px-2.5 py-1 rounded-full bg-white border border-emerald-200 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Hoạt động</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs text-gray-600">Tất cả API đã sẵn sàng. Chế độ <b>Demo</b> dùng Pollinations + Web Speech (không cần key). Bật <b>LIVE</b> trong Cài đặt để dùng OpenAI/Replicate/ElevenLabs thật.</div>
          </Card>

          <Card className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Thư viện nổi bật</h3>
              <Link href="/resources" className="text-xs text-[#7C5BFF] font-medium hover:underline">Xem tất cả</Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200",
              ].map((u, i) => <motion.img key={i} whileHover={{ scale: 1.05 }} src={u} alt="" className="h-20 w-full object-cover rounded-xl border border-[#E9ECF5] cursor-pointer hover:shadow-md transition" onClick={()=>toast("Đã thêm vào dự án","success")} />)}
            </div>
            <Button variant="subtle" className="w-full mt-3" onClick={()=>toast("Đã mở thư viện","info")}>Khám phá mẫu</Button>
          </Card>
        </div>
      </div>

      <Modal open={!!preview} onClose={()=>setPreview(null)} title="Xem trước dự án" size="lg">
        {preview && (() => {
          const p = projects.find(x=>x.id===preview);
          if(!p) return null;
          return (
            <div>
              <img src={p.scenes[0]?.imageUrl || p.scenes[0]?.thumbnail} className="w-full h-56 object-cover rounded-xl" alt="" />
              <h4 className="font-semibold mt-3">{p.title}</h4><p className="text-sm text-gray-600">{p.topic}</p>
              <div className="flex gap-2 mt-4"><Link href={`/projects/${p.id}/studio`} className="flex-1 bg-[#7C5BFF] text-white py-2.5 rounded-xl text-center font-medium">Mở Studio</Link><Link href={`/projects/${p.id}/storyboard`} className="px-5 py-2.5 rounded-xl border font-medium">Storyboard</Link></div>
            </div>
          );
        })()}
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Xóa dự án?" size="sm">
        <p className="text-sm text-gray-600">Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-2 mt-6"><Button variant="ghost" onClick={()=>setDelId(null)}>Hủy</Button><Button variant="danger" onClick={()=>{ deleteProject(delId!); toast("Đã xóa","success"); setDelId(null); }}>Xóa</Button></div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
