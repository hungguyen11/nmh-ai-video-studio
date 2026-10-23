"use client";
import { Card, Button, Badge } from "@/components/ui";
import { Check } from "lucide-react";

const plans = [
  { name: "Miễn phí", price: "0đ", sub: "/ tháng", features: ["5 video / tháng", "Độ phân giải tới 720p", "1 dự án đang thực hiện", "Watermark nhỏ"], cta: "Đang dùng", active: true },
  { name: "Pro", price: "199.000đ", sub: "/ tháng", features: ["100 video / tháng", "Độ phân giải tới 1080p", "Không giới hạn dự án", "Không watermark"], cta: "Nâng cấp", active: false, popular: true },
  { name: "Business", price: "499.000đ", sub: "/ tháng", features: ["500 video / tháng", "4K + API riêng", "Quản lý nhóm", "Hỗ trợ ưu tiên"], cta: "Nâng cấp", active: false },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Gói dịch vụ & Hạn mức</h1>
      <p className="text-sm text-gray-500">Chọn gói phù hợp nhu cầu. Thanh toán tích hợp Stripe/VNPay khi triển khai production.</p>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p => (
          <Card key={p.name} className={`p-5 relative ${p.popular ? "ring-2 ring-[#7C5BFF] shadow-lg" : ""}`}>
            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#7C5BFF] text-white text-xs font-bold">Phổ biến</div>}
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1"><span className="text-2xl font-bold">{p.price}</span><span className="text-sm text-gray-500">{p.sub}</span></div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map(f => <li key={f} className="flex gap-2"><span className="w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center text-xs"><Check size={12} /></span>{f}</li>)}
            </ul>
            <Button className={`w-full mt-6 ${p.active ? "bg-gray-100 text-gray-600 hover:bg-gray-100 border" : ""}`} variant={p.active ? "ghost" : "primary"}>{p.cta}</Button>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Sử dụng trong tháng</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-gray-50 border"><div className="text-gray-500">Video đã tạo</div><div className="text-xl font-bold">12 / 20</div><div className="h-1.5 bg-gray-200 rounded-full mt-2"><div className="h-full bg-[#7C5BFF] rounded-full" style={{ width: "60%" }} /></div></div>
          <div className="p-3 rounded-xl bg-gray-50 border"><div className="text-gray-500">Phút video</div><div className="text-xl font-bold">18 / 60 phút</div></div>
          <div className="p-3 rounded-xl bg-gray-50 border"><div className="text-gray-500">Dung lượng</div><div className="text-xl font-bold">1.2 / 5 GB</div></div>
        </div>
        <div className="mt-3 text-xs text-gray-500">Chi phí ước tính: <b>0đ</b> (Demo mode). Khi bật LIVE, hệ thống hiển thị chi phí thực theo usage của provider.</div>
      </Card>
    </div>
  );
}
