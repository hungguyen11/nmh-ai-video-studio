"use client";
import { Card, Badge } from "@/components/ui";

const items = [
  { id: 1, type: "success", title: "Tạo dự án video đã hoàn thành", desc: "Video 'Vì sao máy tính Windows...' đã sẵn sàng.", time: "10:24" },
  { id: 2, type: "info", title: "Cảnh 3 đang xử lý", desc: "Đang tạo video cho cảnh 3. Vui lòng chờ trong giây lát.", time: "10:18" },
  { id: 3, type: "info", title: "Đã lưu bản nháp video", desc: "Bản nháp video của bạn đã được lưu tự động.", time: "09:42" },
  { id: 4, type: "error", title: "Lỗi tạo giọng đọc cho cảnh 2", desc: "Không thể tạo giọng đọc. Vui lòng thử lại. Yêu cầu đã được ghi log.", time: "07:16" },
  { id: 5, type: "info", title: "Đã nâng cấp gói dịch vụ", desc: "Bạn đã nâng cấp lên Pro. Cảm ơn bạn!", time: "Hôm qua" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trung tâm thông báo</h1>
        <Badge tone="purple">5 thông báo</Badge>
      </div>
      <Card className="divide-y">
        {items.map(n => (
          <div key={n.id} className="p-4 flex gap-3">
            <div className={`w-8 h-8 rounded-full grid place-items-center text-white text-xs shrink-0 ${n.type === "success" ? "bg-emerald-500" : n.type === "error" ? "bg-red-500" : n.type === "info" ? "bg-blue-500" : "bg-gray-400"}`}>{n.type === "success" ? "✓" : n.type === "error" ? "!" : "i"}</div>
            <div className="flex-1">
              <div className="text-sm font-medium">{n.title}</div>
              <div className="text-xs text-gray-500">{n.desc}</div>
            </div>
            <div className="text-xs text-gray-400 shrink-0">{n.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
