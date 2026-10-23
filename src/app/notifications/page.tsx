"use client";
import { Card, Badge, Button, Modal, useToast } from "@/components/ui";
import { useStore } from "@/lib/store";
import { CheckCheck, Trash2, Bell, Filter } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const { notifications, markAllRead } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const { toast, ToastContainer } = useToast();

  const filtered = notifications.filter(n => filter==="all" || n.type===filter);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold flex items-center gap-2"><Bell size={20} className="text-[#7C5BFF]" /> Trung tâm thông báo</h1>
        <div className="flex items-center gap-2">
          <Badge tone="purple">{notifications.length} thông báo</Badge>
          <Button size="sm" variant="ghost" onClick={()=>{ markAllRead(); toast("Đã đánh dấu đã đọc","success"); }}><CheckCheck size={14} className="mr-1" /> Đã đọc</Button>
        </div>
      </div>

      <Card className="p-2 flex gap-2 w-fit">
        {[
          { id: "all", label: "Tất cả" },
          { id: "success", label: "Thành công" },
          { id: "info", label: "Thông tin" },
          { id: "error", label: "Lỗi" },
        ].map(f => <button key={f.id} onClick={()=>setFilter(f.id)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${filter===f.id ? "bg-[#7C5BFF] text-white shadow" : "bg-white border hover:bg-gray-50"}`}>{f.label}</button>)}
      </Card>

      <Card className="divide-y overflow-hidden">
        <AnimatePresence>
          {filtered.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={`p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${n.read ? "opacity-60" : ""}`} onClick={()=>toast(n.title,"info")}>
              <div className={`w-9 h-9 rounded-full grid place-items-center text-white text-xs shrink-0 shadow-sm ${n.type === "success" ? "bg-emerald-500" : n.type === "error" ? "bg-red-500" : "bg-blue-500"}`}>{n.type === "success" ? "✓" : n.type === "error" ? "!" : "i"}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium flex items-center gap-2">{n.title} {!n.read && <span className="w-2 h-2 bg-[#7C5BFF] rounded-full animate-pulse" />}</div>
                <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
              </div>
              <div className="text-xs text-gray-400 shrink-0 flex flex-col items-end gap-1">
                <span>{n.time}</span>
                <Badge tone={n.type==="success"?"green":n.type==="error"?"red":"blue"}>{n.type}</Badge>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length===0 && <div className="p-10 text-center text-sm text-gray-500">Không có thông báo nào.</div>}
      </Card>

      <Card className="p-4 bg-[#F5F3FF] border-dashed">
        <div className="text-sm font-medium">Mọi hoạt động đều được ghi log:</div>
        <ul className="text-xs text-gray-600 list-disc ml-5 mt-1 space-y-1">
          <li>Nhấn vào thông báo để xem chi tiết dự án liên quan.</li>
          <li>Lỗi API được hiển thị rõ với mã yêu cầu — không tự retry vô hạn.</li>
          <li>Bạn có thể xóa lịch sử sau 30 ngày trong Cài đặt.</li>
        </ul>
        <Button size="sm" variant="ghost" className="mt-3" onClick={()=>toast("Đã xóa lịch sử cũ","success")}><Trash2 size={14} className="mr-1" /> Xóa lịch sử</Button>
      </Card>

      <ToastContainer />
    </div>
  );
}
