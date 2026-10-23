"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Input, Badge, Progress } from "@/components/ui";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProjectsPage() {
  const { projects, deleteProject } = useStore();
  const [q, setQ] = useState("");
  const filtered = projects.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.topic.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dự án của tôi</h1>
        <Link href="/projects/new" className="inline-flex items-center gap-2 bg-[#7C5BFF] text-white px-4 py-2 rounded-xl text-sm font-medium"><Plus size={16} /> Dự án mới</Link>
      </div>
      <Card className="p-3 flex items-center gap-2">
        <Search size={16} className="text-gray-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tiêu đề, chủ đề..." className="flex-1 outline-none text-sm" />
        <Badge tone="gray">{filtered.length} dự án</Badge>
      </Card>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="overflow-hidden flex flex-col">
            <img src={p.scenes[0]?.thumbnail || `https://picsum.photos/seed/${p.id}/400/225`} alt="" className="h-40 w-full object-cover" />
            <div className="p-4 flex-1">
              <div className="text-sm font-semibold line-clamp-2">{p.title}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.topic}</div>
              <div className="mt-3"><Progress value={p.progress} /></div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500"><span>{p.scenes.length} cảnh • {p.config.aspectRatio}</span><Badge tone={p.status === "completed" ? "green" : p.status === "generating" ? "purple" : "gray"}>{p.status}</Badge></div>
            </div>
            <div className="p-3 border-t bg-gray-50 flex gap-2">
              <Link href={`/projects/${p.id}/studio`} className="flex-1 text-center py-2 rounded-xl bg-[#7C5BFF] text-white text-sm font-medium">Mở Studio</Link>
              <Link href={`/projects/${p.id}/storyboard`} className="px-3 py-2 rounded-xl bg-white border text-sm">Storyboard</Link>
              <button onClick={() => deleteProject(p.id)} className="w-9 h-9 grid place-items-center rounded-xl bg-white border text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <Card className="p-10 text-center text-sm text-gray-500">Không có dự án nào khớp.</Card>}
    </div>
  );
}
