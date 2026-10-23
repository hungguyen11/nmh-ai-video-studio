"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Input, Label, Badge, Textarea } from "@/components/ui";
import { useState } from "react";

export default function SettingsPage() {
  const user = useStore(s => s.user);
  const [keys, setKeys] = useState({ openai: "", eleven: "", replicate: "" });
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Cài đặt tài khoản & Dịch vụ</h1>

      <Card className="p-5">
        <h3 className="font-semibold">Hồ sơ</h3>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div><Label>Họ tên</Label><Input defaultValue={user?.name} /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} /></div>
          <div><Label>Mật khẩu mới</Label><Input type="password" placeholder="••••••" /></div>
          <div><Label>Avatar URL</Label><Input defaultValue={user?.avatar} /></div>
        </div>
        <Button className="mt-4">Lưu hồ sơ</Button>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Kết nối AI Provider</h3>
        <p className="text-xs text-gray-500">API key chỉ lưu ở backend (env). Frontend không bao giờ thấy key thật. Đang ở Demo mode — bạn vẫn có thể trải nghiệm đầy đủ luồng mà không tốn phí.</p>
        <div className="mt-4 space-y-3">
          <div><Label>OpenAI (script, prompt)</Label><Input value={keys.openai} onChange={e => setKeys({ ...keys, openai: e.target.value })} placeholder="sk-... (lưu vào .env OPENAI_API_KEY)" /></div>
          <div><Label>Replicate / Stability (image/video)</Label><Input value={keys.replicate} onChange={e => setKeys({ ...keys, replicate: e.target.value })} placeholder="r8_... (REPLICATE_API_TOKEN)" /></div>
          <div><Label>ElevenLabs / OpenAI TTS (giọng đọc)</Label><Input value={keys.eleven} onChange={e => setKeys({ ...keys, eleven: e.target.value })} placeholder="xi-... (ELEVENLABS_API_KEY)" /></div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs">
          <b>Hướng dẫn:</b> Tạo file <code>.env.local</code> từ <code>.env.example</code>, điền key, restart server. Khi có key, đặt <code>NEXT_PUBLIC_AI_MODE=live</code> để bật chế độ thật. Xem <code>README.md</code>.
        </div>
        <Badge tone="purple" className="mt-3">Hiện tại: Demo</Badge>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Tùy chọn Studio</h3>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white"><span>Tự động lưu dự án</span><input type="checkbox" defaultChecked className="accent-[#7C5BFF]" /></label>
          <label className="flex items-center justify-between p-3 rounded-xl border bg-white"><span>Hiển thị ước tính chi phí</span><input type="checkbox" defaultChecked className="accent-[#7C5BFF]" /></label>
        </div>
      </Card>
    </div>
  );
}
