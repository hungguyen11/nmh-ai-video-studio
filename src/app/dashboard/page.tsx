"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Progress } from "@/components/ui";
import { Plus, Play, Clock, CheckCircle2, AlertCircle, Sparkles, Video, Mic, Image as ImageIcon } from "lucide-react";

export default function Dashboard() {
  const { projects, user } = useStore();
  const stats = [
    { label: "Dự án gần đây", value: projects.length, tone: "orange", icon: Clock },
    { label: "Đang xử lý", value: projects.filter(p => p.status === "generating").length, tone: "purple", icon: Sparkles },
    { label: "Bản nháp", value: projects.filter(p => p.status === "draft").length, tone: "orange", icon: AlertCircle },
    { label: "Video đã xuất", value: projects.filter(p => p.status === "completed").length, tone: "blue", icon: Video },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold">Xin chào, {user?.name}!</h1>
          <p className="text-sm text-gray-500">Cùng tạo những video tuyệt vời</p>
        </div>
        <Link href="/projects/new" className="inline-flex items-center gap-2 bg-[#7C5BFF] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4EFF]"><Plus size={16} /> Tạo dự án mới</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon as any;
          return (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl grid place-items-center ${s.tone === "purple" ? "bg-[#EDE9FE] text-[#7C5BFF]" : s.tone === "orange" ? "bg-orange-50 text-orange-600" : s.tone === "blue" ? "bg-blue-50 text-blue-600" : "bg-gray-50"}`}><Icon size={16} /></div>
              <div><div className="text-xs text-gray-500">{s.label}</div><div className="text-xl font-bold">{s.value}</div></div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Dự án gần đây</h3>
            <Link href="/projects" className="text-sm text-[#7C5BFF] font-medium">Xem tất cả</Link>
          </div>
          <div className="mt-4 space-y-3">
            {projects.map(p => (
              <Link key={p.id} href={`/projects/${p.id}/studio`} className="flex items-center gap-3 p-3 rounded-2xl border border-[#E9ECF5] hover:bg-gray-50 transition">
                <img src={p.scenes[0]?.thumbnail || "https://picsum.photos/seed/" + p.id + "/120/68"} alt="" className="w-[96px] h-[54px] rounded-xl object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.topic}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={p.progress} />
                    <span className="text-xs text-gray-500 shrink-0">{p.progress}%</span>
                  </div>
                </div>
                <Badge tone={p.status === "completed" ? "green" : p.status === "generating" ? "purple" : "gray"}>{p.status === "completed" ? "Hoàn thành" : p.status === "generating" ? "Đang tạo" : p.status === "editing" ? "Đang sửa" : "Nháp"}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold">Trạng thái AI</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><span className="flex items-center gap-2"><ImageIcon size={14} /> Tạo ảnh</span><span className="text-emerald-700 font-medium text-xs px-2 py-1 rounded-full bg-white border">Hoạt động</span></div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><span className="flex items-center gap-2"><Video size={14} /> Tạo video</span><span className="text-emerald-700 font-medium text-xs px-2 py-1 rounded-full bg-white border">Hoạt động</span></div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><span className="flex items-center gap-2"><Mic size={14} /> Giọng đọc</span><span className="text-emerald-700 font-medium text-xs px-2 py-1 rounded-full bg-white border">Hoạt động</span></div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><span className="flex items-center gap-2"><SubtitlesIcon /> Nhập video</span><span className="text-emerald-700 font-medium text-xs px-2 py-1 rounded-full bg-white border">Hoạt động</span></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Chế độ Demo — dữ liệu mẫu, không tốn phí API. Bật LIVE trong .env để dùng provider thật.</div>
          </Card>

          <Card className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Thư viện tài nguyên</h3>
              <Link href="/resources" className="text-xs text-[#7C5BFF]">Xem tất cả</Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200",
              ].map((u, i) => <img key={i} src={u} alt="" className="h-20 w-full object-cover rounded-xl border border-[#E9ECF5]" />)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
function SubtitlesIcon() { return <span className="w-3.5 h-3.5 grid place-items-center text-[10px] border rounded">CC</span>; }
