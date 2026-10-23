"use client";
import { useStore } from "@/lib/store";
import { Card, Badge, Button, Modal, useToast } from "@/components/ui";
import { Download, Edit, Trash2, Search, Play, Share2, Copy, Eye, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LibraryPage() {
  const { projects, deleteProject } = useStore();
  const all = projects.filter(p => p.status === "completed" || p.exportedUrl || p.progress===100);
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<string|null>(null);
  const [filter, setFilter] = useState("all");
  const { toast, ToastContainer } = useToast();

  const filtered = all.filter(p => {
    const mq = !q || p.title.toLowerCase().includes(q.toLowerCase());
    const mf = filter==="all" || p.config.resolution===filter;
    return mq && mf;
  });

  const handleDownload = (p:any) => {
    const a = document.createElement('a');
    a.href = "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";
    a.download = `${p.title}.mp4`; a.target="_blank"; a.click();
    toast("Đang tải video...","success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Video đã xuất — Thư viện</h1>
        <Badge tone="purple">{filtered.length} video</Badge>
      </div>

      <Card className="p-3 flex flex-wrap items-center gap-2">
        <Search size={16} className="text-gray-400" />
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm video đã xuất..." className="flex-1 outline-none text-sm min-w-[180px] bg-transparent" />
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="px-3 py-1.5 rounded-xl border bg-white text-sm">
          <option value="all">Tất cả độ phân giải</option><option value="720p">720p</option><option value="1080p">1080p</option><option value="4K">4K</option>
        </select>
        <Button size="sm" variant="ghost" onClick={()=>toast("Đã lọc","info")}><Filter size={14} /></Button>
      </Card>

      {filtered.length===0 ? (
        <Card className="p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5F3FF] grid place-items-center text-2xl mb-3">🎬</div>
          <div className="font-medium">Chưa có video đã xuất</div>
          <div className="text-sm text-gray-500 mt-1">Hoàn thiện dự án và nhấn Xuất MP4 trong Studio để video xuất hiện ở đây.</div>
          <Link href="/dashboard" className="inline-flex mt-4 bg-[#7C5BFF] text-white px-5 py-2.5 rounded-xl text-sm font-medium">Về Dashboard</Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs"><tr><th className="text-left p-3 font-medium">Video</th><th className="text-left p-3 font-medium">Thời lượng</th><th className="text-left p-3 font-medium">Ngày xuất</th><th className="text-left p-3 font-medium">Trạng thái</th><th className="p-3"></th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 flex items-center gap-3">
                      <div className="relative group cursor-pointer" onClick={()=>setPreview(p.id)}>
                        <img src={p.scenes[0]?.thumbnail || `https://picsum.photos/seed/${p.id}/80/45`} className="w-20 h-12 rounded-lg object-cover border" alt="" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg grid place-items-center opacity-0 group-hover:opacity-100 transition"><Play size={14} className="text-white fill-white" /></div>
                      </div>
                      <div><div className="font-medium line-clamp-1 hover:text-[#7C5BFF] cursor-pointer" onClick={()=>setPreview(p.id)}>{p.title}</div><div className="text-xs text-gray-500">{p.config.resolution} • {p.config.aspectRatio} • {p.scenes.length} cảnh</div></div>
                    </td>
                    <td className="p-3 text-gray-600">01:{String(p.scenes.reduce((a,b)=>a+b.duration,0)).padStart(2,"0")} • {p.config.resolution}</td>
                    <td className="p-3 text-gray-600">{new Date(p.updatedAt).toLocaleDateString("vi-VN")}</td>
                    <td className="p-3"><Badge tone="green" dot>Hoàn thành</Badge></td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={()=>setPreview(p.id)}><Eye size={14} /></Button>
                        <Button size="sm" variant="ghost" onClick={()=>handleDownload(p)}><Download size={14} /> Tải</Button>
                        <Button size="sm" variant="ghost" onClick={()=>{ navigator.clipboard.writeText(window.location.href); toast("Đã copy link","success"); }}><Share2 size={14} /></Button>
                        <Link href={`/projects/${p.id}/studio`} className="px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50 text-sm flex items-center gap-1"><Edit size={14} /> Sửa</Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-gradient-to-r from-[#EDE9FE] to-[#FFF7ED] border-dashed">
        <div className="text-sm font-medium">Mẹo:</div>
        <ul className="text-xs text-gray-600 list-disc ml-5 mt-1 space-y-1">
          <li>Nhấn <b>Xem</b> để preview nhanh trước khi tải.</li>
          <li>Nhấn <b>Sửa</b> để quay lại Studio chỉnh và xuất lại — không mất dự án gốc.</li>
          <li>Video LIVE sẽ được lưu trên S3 và có link chia sẻ vĩnh viễn.</li>
        </ul>
      </Card>

      <Modal open={!!preview} onClose={()=>setPreview(null)} title="Xem video đã xuất" size="lg">
        {preview && (()=>{ const p=projects.find(x=>x.id===preview); if(!p) return null; return (<div><div className="aspect-video bg-black rounded-xl overflow-hidden"><video controls autoPlay src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" className="w-full h-full" /></div><h4 className="font-semibold mt-3">{p.title}</h4><p className="text-sm text-gray-500">{p.topic}</p><div className="flex gap-2 mt-4"><Button className="flex-1" onClick={()=>handleDownload(p!)}><Download size={14} className="mr-1" /> Tải MP4</Button><Button variant="ghost" onClick={()=>{ navigator.clipboard.writeText(window.location.href); toast("Đã copy link","success"); }}><Copy size={14} className="mr-1" /> Copy link</Button><Link href={`/projects/${p.id}/studio`} className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-gray-50">Chỉnh sửa</Link></div></div>); })()}
      </Modal>

      <ToastContainer />
    </div>
  );
}
