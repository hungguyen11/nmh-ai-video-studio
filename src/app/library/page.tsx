"use client";
import { useStore } from "@/lib/store";
import { Card, Badge, Button, Input } from "@/components/ui";
import { Download, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";

export default function LibraryPage() {
  const projects = useStore(s => s.projects.filter(p => p.status === "completed" || p.exportedUrl));
  const [q, setQ] = useState("");
  const filtered = projects.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Video đã xuất — Thư viện</h1>
      <Card className="p-3 flex items-center gap-2">
        <Search size={16} className="text-gray-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm video đã xuất..." className="flex-1 outline-none text-sm" /><Badge tone="gray">{filtered.length} video</Badge>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs"><tr><th className="text-left p-3 font-medium">Video</th><th className="text-left p-3 font-medium">Thời lượng</th><th className="text-left p-3 font-medium">Ngày xuất</th><th className="text-left p-3 font-medium">Trạng thái</th><th className="p-3"></th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3"><img src={p.scenes[0]?.thumbnail || `https://picsum.photos/seed/${p.id}/80/45`} className="w-16 h-9 rounded-lg object-cover border" alt="" /><div><div className="font-medium line-clamp-1">{p.title}</div><div className="text-xs text-gray-500">{p.config.resolution} • {p.config.aspectRatio}</div></div></td>
                <td className="p-3 text-gray-600">01:{String(p.scenes.reduce((a,b)=>a+b.duration,0)).padStart(2,"0")} • 1080p</td>
                <td className="p-3 text-gray-600">{new Date(p.updatedAt).toLocaleDateString("vi-VN")}</td>
                <td className="p-3"><Badge tone="green">Hoàn thành</Badge></td>
                <td className="p-3 flex gap-1 justify-end"><Button size="sm" variant="ghost"><Download size={14} /> Tải</Button><Button size="sm" variant="ghost"><Edit size={14} /> Chỉnh</Button></td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={5} className="p-10 text-center text-gray-500">Chưa có video đã xuất. Hãy hoàn thiện dự án và nhấn Xuất MP4 trong Studio.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
