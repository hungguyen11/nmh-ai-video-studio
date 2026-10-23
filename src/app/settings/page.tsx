"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Input, Label, Badge, Textarea, Modal, useToast } from "@/components/ui";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, TestTube, Save, Eye, EyeOff, Check, Zap, Shield, Bell } from "lucide-react";
import { testProvider } from "@/lib/api";

export default function SettingsPage() {
  const user = useStore(s => s.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [keys, setKeys] = useState({ openai: "", eleven: "", replicate: "", stability: "" });
  const [showKeys, setShowKeys] = useState(false);
  const [testing, setTesting] = useState<string|null>(null);
  const [notif, setNotif] = useState({ email: true, push: true, marketing: false });
  const { toast, ToastContainer } = useToast();

  const handleSaveProfile = () => {
    useStore.getState().login(email, name);
    toast("Đã lưu hồ sơ!","success");
  };

  const handleTest = async (provider: string, key: string) => {
    setTesting(provider);
    const res = await testProvider(provider, key);
    setTesting(null);
    toast(res.msg, res.ok ? "success" : "error");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Cài đặt tài khoản & Dịch vụ</h1>
        <p className="text-sm text-gray-500">Quản lý hồ sơ, API keys và tùy chọn. Mọi thay đổi được áp dụng ngay.</p>
      </motion.div>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><User size={16} className="text-[#7C5BFF]" /> Hồ sơ</h3>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div><Label>Họ tên</Label><Input value={name} onChange={(e:any)=>setName(e.target.value)} placeholder="Nguyễn Văn A" /></div>
          <div><Label>Email</Label><Input value={email} onChange={(e:any)=>setEmail(e.target.value)} placeholder="you@company.com" /></div>
          <div><Label>Avatar URL</Label><Input defaultValue={user?.avatar} placeholder="https://..." onChange={()=>toast("Nhấn Lưu để áp dụng","info")} /></div>
          <div><Label>Mật khẩu mới</Label><div className="relative"><Input type={showKeys?"text":"password"} placeholder="••••••" /><button onClick={()=>setShowKeys(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showKeys ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSaveProfile}><Save size={14} className="mr-1" /> Lưu hồ sơ</Button>
          <Button variant="ghost" onClick={()=>toast("Đã gửi email xác minh","info")}>Gửi xác minh</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><Key size={16} className="text-amber-600" /> Kết nối AI Provider</h3>
        <p className="text-xs text-gray-500 mt-1">API key chỉ lưu ở backend (env). Frontend không bao giờ thấy key thật. Đang ở <Badge tone="purple">Demo mode</Badge> — vẫn trải nghiệm đầy đủ mà không tốn phí.</p>
        <div className="mt-4 space-y-3">
          {[
            { k: "openai", label: "OpenAI (script, prompt)", ph: "sk-... (OPENAI_API_KEY)" },
            { k: "replicate", label: "Replicate / Stability (image/video)", ph: "r8_... (REPLICATE_API_TOKEN)" },
            { k: "eleven", label: "ElevenLabs / OpenAI TTS (giọng đọc)", ph: "xi-... (ELEVENLABS_API_KEY)" },
            { k: "stability", label: "Stability AI (ảnh)", ph: "sk-... (STABILITY_API_KEY)" },
          ].map(f => (
            <div key={f.k} className="flex gap-2 items-end">
              <div className="flex-1"><Label>{f.label}</Label><Input type={showKeys?"text":"password"} value={(keys as any)[f.k]} onChange={(e:any)=>setKeys({ ...keys, [f.k]: e.target.value })} placeholder={f.ph} /></div>
              <Button size="sm" variant="ghost" onClick={()=>handleTest(f.k, (keys as any)[f.k])} disabled={testing===f.k} className="shrink-0">{testing===f.k ? <span className="w-4 h-4 border-2 border-gray-300 border-t-[#7C5BFF] rounded-full animate-spin" /> : <><TestTube size={12} className="mr-1" /> Test</>}</Button>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs flex gap-2">
          <Zap size={14} className="text-[#7C5BFF] shrink-0 mt-0.5" />
          <div>Hướng dẫn: Tạo file <code className="px-1 py-0.5 bg-white rounded border">.env.local</code> từ <code className="px-1 py-0.5 bg-white rounded border">.env.example</code>, điền key, restart. Đặt <code className="px-1 py-0.5 bg-white rounded border">NEXT_PUBLIC_AI_MODE=live</code> để bật chế độ thật. Xem README.md. <button onClick={()=>{ setKeys({ openai: "sk-demo123456789", eleven: "xi-demo123456", replicate: "r8_demo123", stability: "sk-demo123" }); toast("Đã điền demo keys","success"); }} className="underline text-[#7C5BFF]">Điền demo</button></div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="purple">Hiện tại: Demo</Badge>
          <button onClick={()=>toast("Đã lưu keys (demo) — bản LIVE sẽ lưu server env","success")} className="text-xs text-[#7C5BFF] underline">Lưu keys</button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><Bell size={16} /> Tùy chọn</h3>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer transition">
            <span className="flex items-center gap-2"><Save size={14} /> Tự động lưu dự án</span>
            <input type="checkbox" defaultChecked className="accent-[#7C5BFF] w-4 h-4" onChange={()=>toast("Đã bật tự động lưu","success")} />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer">
            <span className="flex items-center gap-2"><Eye size={14} /> Hiển thị ước tính chi phí</span>
            <input type="checkbox" defaultChecked className="accent-[#7C5BFF] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer">
            <span>Email thông báo</span>
            <input type="checkbox" checked={notif.email} onChange={()=>setNotif({...notif, email: !notif.email})} className="accent-[#7C5BFF] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer">
            <span>Push notification</span>
            <input type="checkbox" checked={notif.push} onChange={()=>setNotif({...notif, push: !notif.push})} className="accent-[#7C5BFF] w-4 h-4" />
          </label>
        </div>
        <Button className="mt-4" onClick={()=>toast("Đã lưu cài đặt","success")}><Check size={14} className="mr-1" /> Lưu cài đặt</Button>
      </Card>

      <Card className="p-5 border-red-200 bg-red-50/50">
        <h3 className="font-semibold text-red-700">Vùng nguy hiểm</h3>
        <p className="text-xs text-red-600 mt-1">Xóa tài khoản sẽ xóa tất cả dự án và không thể khôi phục.</p>
        <div className="flex gap-2 mt-3">
          <Button variant="ghost" onClick={()=>toast("Đã đăng xuất","info")}>Đăng xuất</Button>
          <Button variant="danger" onClick={()=> { if(confirm("Bạn chắc chắn muốn xóa tài khoản?")) toast("Đã gửi yêu cầu xóa","success"); }}>Xóa tài khoản</Button>
        </div>
      </Card>

      <ToastContainer />
    </div>
  );
}
