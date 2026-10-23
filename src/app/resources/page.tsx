"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Input, Label } from "@/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ResourcesPage() {
  const projects = useStore(s => s.projects);
  const chars = projects.flatMap(p => p.characters.map(c => ({ ...c, project: p.title })));
  const [tab, setTab] = useState("Nhân vật");
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Thư viện tài nguyên & Nhân vật</h1>
      <Card className="p-2 flex gap-2 w-fit">
        {["Nhân vật", "Bối cảnh", "Đạo cụ", "Âm thanh"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === t ? "bg-[#7C5BFF] text-white" : "bg-white border"}`}>{t}</button>)}
      </Card>

      <Card className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Nhân vật — giữ nhất quán qua các cảnh</h3>
          <Button size="sm"><Plus size={14} className="mr-1" /> Tạo nhân vật mới</Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Lưu đặc điểm nhận diện, trang phục, màu sắc. Hệ thống sẽ tái sử dụng reference khi provider hỗ trợ (ví dụ IP-Adapter / Character Reference).</p>
        <div className="mt-4 grid md:grid-cols-4 gap-4">
          {chars.map(c => (
            <div key={c.id} className="rounded-2xl border border-[#E9ECF5] overflow-hidden bg-white">
              <img src={c.avatar} alt="" className="h-36 w-full object-cover" />
              <div className="p-3">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.description}</div>
                <div className="mt-2 flex flex-wrap gap-1.5"><Badge tone="purple">{c.traits}</Badge><Badge tone="gray">{c.outfit}</Badge></div>
                <div className="text-[11px] text-gray-400 mt-2">Từ: {c.project}</div>
              </div>
            </div>
          ))}
          {chars.length === 0 && <div className="text-sm text-gray-500 p-6 border rounded-xl col-span-4 text-center">Chưa có nhân vật. Tạo ở bước Nhân vật hoặc trong Studio.</div>}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">Lưu ý: Không hứa hẹn nhất quán tuyệt đối nếu model không hỗ trợ. Chúng tôi luôn hiển thị rõ model đang dùng và mức độ nhất quán kỳ vọng.</div>
      </Card>
    </div>
  );
}
