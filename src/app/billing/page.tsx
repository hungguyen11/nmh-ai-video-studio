"use client";
import { Card, Button, Badge, Modal, useToast, Input, Label } from "@/components/ui";
import { Check, Sparkles, CreditCard, Shield, Zap, Crown, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  { name: "Miễn phí", price: "0đ", sub: "/ tháng", features: ["5 video / tháng", "Độ phân giải tới 720p", "1 dự án đang thực hiện", "Watermark nhỏ"], cta: "Đang dùng", active: true, icon: Sparkles },
  { name: "Pro", price: "199.000đ", sub: "/ tháng", features: ["100 video / tháng", "Độ phân giải tới 1080p", "Không giới hạn dự án", "Không watermark", "API priority"], cta: "Nâng cấp", active: false, popular: true, icon: Zap },
  { name: "Business", price: "499.000đ", sub: "/ tháng", features: ["500 video / tháng", "4K + API riêng", "Quản lý nhóm 5 người", "Hỗ trợ ưu tiên 24/7", "SSO & audit log"], cta: "Nâng cấp", active: false, icon: Crown },
];

export default function BillingPage() {
  const [showCheckout, setShowCheckout] = useState<string|null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast, ToastContainer } = useToast();

  const handleUpgrade = (name: string) => {
    if (name==="Miễn phí") { toast("Bạn đang dùng gói này","info"); return; }
    setShowCheckout(name);
  };
  const confirmPay = () => {
    setShowCheckout(null);
    setShowSuccess(true);
    setTimeout(()=> setShowSuccess(false), 3000);
    toast("Thanh toán thành công! Gói đã được nâng cấp (demo)","success");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Gói dịch vụ & Hạn mức</h1>
        <p className="text-sm text-gray-500 mt-1">Chọn gói phù hợp nhu cầu. Thanh toán demo hoạt động đầy đủ — bản LIVE tích hợp Stripe/VNPay.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p,i) => {
          const Icon = p.icon as any;
          return (
            <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.08 }} whileHover={{ y: -4 }}>
              <Card className={`p-5 relative h-full flex flex-col hover:shadow-xl transition ${p.popular ? "ring-2 ring-[#7C5BFF] shadow-lg" : "hover:shadow-md"}`}>
                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#7C5BFF] text-white text-xs font-bold shadow-md flex items-center gap-1"><Crown size={12} /> Phổ biến</div>}
                <div className={`w-10 h-10 rounded-xl grid place-items-center ${p.active ? "bg-gray-100 text-gray-600" : p.popular ? "bg-[#7C5BFF] text-white" : "bg-[#EDE9FE] text-[#7C5BFF]"}`}><Icon size={18} /></div>
                <div className="text-sm font-semibold mt-3">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-2xl font-bold">{p.price}</span><span className="text-sm text-gray-500">{p.sub}</span></div>
                <ul className="mt-4 space-y-2 text-sm flex-1">
                  {p.features.map(f => <li key={f} className="flex gap-2 items-center"><span className="w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center text-xs shrink-0"><Check size={12} /></span>{f}</li>)}
                </ul>
                <Button className={`w-full mt-6 ${p.active ? "bg-gray-100 text-gray-600 hover:bg-gray-100 border" : ""}`} variant={p.active ? "ghost" : "primary"} onClick={()=>handleUpgrade(p.name)}>{p.cta} {p.active ? "" : "→"}</Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Sử dụng trong tháng</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-gray-50 border hover:bg-white hover:shadow-sm transition"><div className="text-gray-500 text-xs">Video đã tạo</div><div className="text-xl font-bold">12 / 20</div><div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1 }} className="h-full bg-[#7C5BFF] rounded-full" /></div><div className="text-xs text-gray-500 mt-1">Còn 8 lượt</div></div>
          <div className="p-4 rounded-xl bg-gray-50 border hover:bg-white transition"><div className="text-gray-500 text-xs">Phút video</div><div className="text-xl font-bold">18 / 60 phút</div><div className="h-2 bg-gray-200 rounded-full mt-2"><div className="h-full bg-emerald-500 w-[30%] rounded-full" /></div></div>
          <div className="p-4 rounded-xl bg-gray-50 border hover:bg-white transition"><div className="text-gray-500 text-xs">Dung lượng</div><div className="text-xl font-bold">1.2 / 5 GB</div><div className="h-2 bg-gray-200 rounded-full mt-2"><div className="h-full bg-blue-500 w-[24%] rounded-full" /></div></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone="green">Chi phí ước tính: 0đ (Demo)</Badge>
          <span className="text-gray-500">Khi bật LIVE, hiển thị chi phí thực theo usage của provider (Replicate/ElevenLabs).</span>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><CreditCard size={16} /> Lịch sử thanh toán</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between p-3 rounded-xl bg-white border hover:bg-gray-50 transition"><span>12/10/2025 — Gói Pro</span><span className="font-medium">199.000đ</span><Badge tone="green">Thành công</Badge></div>
          <div className="flex justify-between p-3 rounded-xl bg-white border hover:bg-gray-50 transition"><span>12/09/2025 — Gói Pro</span><span className="font-medium">199.000đ</span><Badge tone="green">Thành công</Badge></div>
        </div>
        <Button variant="ghost" size="sm" className="mt-3" onClick={()=>toast("Đã tải hóa đơn","success")}>Tải hóa đơn PDF</Button>
      </Card>

      <Modal open={!!showCheckout} onClose={()=>setShowCheckout(null)} title={`Thanh toán — Gói ${showCheckout}`} size="md">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#F5F3FF] border text-sm flex items-center gap-2"><Shield size={16} className="text-emerald-600" /> Thanh toán an toàn qua Stripe/VNPay (demo: không trừ tiền thật).</div>
          <div><Label>Số thẻ</Label><Input placeholder="4242 4242 4242 4242" /></div>
          <div className="grid grid-cols-2 gap-3"><div><Label>MM/YY</Label><Input placeholder="12/28" /></div><div><Label>CVC</Label><Input placeholder="123" /></div></div>
          <div><Label>Email nhận hóa đơn</Label><Input placeholder="you@company.com" defaultValue="minh@nmh.studio" /></div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">Demo: Nhấn “Thanh toán” sẽ mô phỏng thành công, không trừ tiền. Bản production sẽ gọi Stripe API thật.</div>
          <div className="flex gap-2 justify-end"><Button variant="ghost" onClick={()=>setShowCheckout(null)}>Hủy</Button><Button onClick={confirmPay}><CreditCard size={14} className="mr-1" /> Thanh toán {showCheckout==="Pro"?"199.000đ":"499.000đ"}</Button></div>
        </div>
      </Modal>

      <Modal open={showSuccess} onClose={()=>setShowSuccess(false)} title="Thanh toán thành công! 🎉" size="sm">
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-full grid place-items-center text-2xl mx-auto">✓</div>
          <p className="text-sm text-gray-600 mt-3">Gói của bạn đã được nâng cấp. Hạn mức mới đã áp dụng ngay.</p>
          <Button className="mt-4 w-full" onClick={()=>setShowSuccess(false)}>Tuyệt vời!</Button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
