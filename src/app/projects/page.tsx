"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Modal, useToast, Input } from "@/components/ui";
import Link from "next/link";
import { Plus, Search, Trash2, Copy, Eye, MoreHorizontal, Filter, ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const { projects, deleteProject, duplicateProject } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [preview, setPreview] = useState<string|null>(null);
  const [del, setDel] = useState<string|null>(null);
  const { toast, ToastContainer } = useToast();

  const filtered = projects.filter(p => {
    const mq = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.topic.toLowerCase().includes(q.toLowerCase());
    const ms = status==="all" || p.status===status;
    return mq && ms;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Dự án của tôi</h1>
        <Link href="/projects/new" className="inline-flex items-center gap-2 bg-[#7C5BFF] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4EFF] shadow-md hover:shadow-lg hover:-translate-y-px transition"><Plus size={16} /> Dự án mới</Link>
      </div>

      <Card className="p-3 flex flex-wrap items-center gap-2">
        <Search size={16} className="text-gray-400" />
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm theo tiêu đề, chủ đề..." className="flex-1 outline-none text-sm min-w-[180px] bg-transparent" />
        <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-1.5 rounded-xl border bg-white text-sm">
          <option value="all">Tất cả</option><option value="draft">Nháp</option><option value="editing">Đang sửa</option><option value="generating">Đang tạo</option><option value="completed">Hoàn thành</option>
        </select>
        <Badge tone="gray">{filtered.length} dự án</Badge>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} layout>
              <Card hover className="overflow-hidden flex flex-col group">
                <div className="relative cursor-pointer" onClick={()=>setPreview(p.id)}>
                  <img src={p.scenes[0]?.thumbnail || `https://picsum.photos/seed/${p.id}/400/225`} alt="" className="h-40 w-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100"><div className="w-10 h-10 rounded-full bg-white grid place-items-center shadow-lg"><Play size={16} className="fill-gray-900 ml-0.5" /></div></div>
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur">{p.config.aspectRatio} • {p.config.resolution}</div>
                  <div className="absolute top-2 right-2"><Badge tone={p.status === "completed" ? "green" : p.status === "generating" ? "orange" : "gray"}>{p.status}</Badge></div>
                  {p.status==="generating" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"><div className="h-full bg-[#7C5BFF]" style={{ width: `${p.progress}%` }} /></div>}
                </div>
                <div className="p-4 flex-1">
                  <div className="text-sm font-semibold line-clamp-2 group-hover:text-[#7C5BFF] transition">{p.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.topic}</div>
                  <div className="mt-3"><Progress value={p.progress} /></div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500"><span>{p.scenes.length} cảnh • {new Date(p.updatedAt).toLocaleDateString("vi-VN")}</span><span>{p.progress}%</span></div>
                </div>
                <div className="p-3 border-t bg-gray-50 flex gap-2">
                  <Link href={`/projects/${p.id}/studio`} className="flex-1 text-center py-2 rounded-xl bg-[#7C5BFF] text-white text-sm font-medium hover:bg-[#6B4EFF] shadow-sm flex items-center justify-center gap-1"><Eye size={14} /> Mở Studio</Link>
                  <button onClick={()=>{ const nid=duplicateProject(p.id); toast("Đã nhân bản","success"); }} className="w-9 h-9 grid place-items-center rounded-xl bg-white border hover:bg-gray-50" title="Nhân bản"><Copy size={14} /></button>
                  <button onClick={()=>setDel(p.id)} className="w-9 h-9 grid place-items-center rounded-xl bg-white border text-red-600 hover:bg-red-50" title="Xóa"><Trash2 size={14} /></button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && <Card className="p-10 text-center text-sm text-gray-500">Không có dự án nào. <Link href="/projects/new" className="text-[#7C5BFF] underline">Tạo ngay</Link></Card>}

      <Modal open={!!preview} onClose={()=>setPreview(null)} title="Xem trước" size="lg">
        {preview && (()=>{ const p=projects.find(x=>x.id===preview); if(!p) return null; return (<div><img src={p.scenes[0]?.imageUrl || p.scenes[0]?.thumbnail || `https://picsum.photos/seed/${p.id}/400/225`} className="w-full h-48 object-cover rounded-xl" alt="" /><h4 className="font-semibold mt-3">{p.title}</h4><p className="text-sm text-gray-600">{p.topic}</p><div className="flex gap-2 mt-4"><Link href={`/projects/${p.id}/studio`} className="flex-1 bg-[#7C5BFF] text-white py-2.5 rounded-xl text-center font-medium">Mở Studio</Link><Link href={`/projects/${p.id}/storyboard`} className="px-5 py-2.5 rounded-xl border font-medium hover:bg-gray-50">Storyboard</Link></div></div>); })()}
      </Modal>

      <Modal open={!!del} onClose={()=>setDel(null)} title="Xóa dự án?" size="sm">
        <p className="text-sm text-gray-600">Bạn chắc chắn muốn xóa dự án này? Không thể hoàn tác.</p>
        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setDel(null)}>Hủy</Button><Button variant="danger" onClick={()=>{ deleteProject(del!); toast("Đã xóa","success"); setDel(null); }}>Xóa</Button></div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
