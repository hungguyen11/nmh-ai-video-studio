"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { ArrowRight, Play, Sparkles, Layers, Mic, Subtitles, Wand2, Clock, Shield, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();
  const createProject = useStore(s => s.createProject);

  const onCreate = () => {
    if (!topic.trim()) return;
    const id = createProject(topic.trim());
    router.push(`/projects/${id}/setup`);
  };

  return (
    <div className="bg-[#F6F7FB]">
      {/* Header for landing (duplicate for SEO) */}
      <div className="max-w-[1280px] mx-auto px-6">
        <header className="h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C5BFF] grid place-items-center text-white font-bold">M</div>
            <span className="font-semibold">NMH AI Video Studio</span>
            <span className="hidden md:inline-flex ml-4 gap-6 text-sm text-gray-600">
              <Link href="#features" className="hover:text-gray-900">Tính năng</Link>
              <Link href="#pricing" className="hover:text-gray-900">Bảng giá</Link>
              <Link href="/dashboard" className="hover:text-gray-900">FAQ</Link>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white border border-transparent hover:border-[#E9ECF5]">Đăng nhập</Link>
            <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-medium bg-[#7C5BFF] text-white hover:bg-[#6B4EFF]">Đăng ký</Link>
          </div>
        </header>

        {/* Hero */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center py-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E9ECF5] text-xs font-medium text-gray-600"><Sparkles size={14} className="text-[#7C5BFF]" /> AI Video Studio mới — Tạo video trong vài phút</div>
            <h1 className="mt-4 text-[42px] leading-[1.05] font-bold tracking-tight">Biến ý tưởng<br /><span className="text-[#7C5BFF]">thành video bằng AI</span></h1>
            <p className="mt-4 text-gray-600 max-w-xl">Chỉ cần nhập chủ đề, AI sẽ tự động tạo kịch bản, phân cảnh, hình ảnh, giọng đọc và dựng thành video hoàn chỉnh.</p>

            <div className="mt-6 flex items-center gap-2 max-w-xl bg-white p-2 rounded-2xl border border-[#E9ECF5] shadow-sm">
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Nhập chủ đề video của bạn..." className="flex-1 px-4 py-2 outline-none text-sm" />
              <Button onClick={onCreate} className="shrink-0">Bắt đầu tạo video <ArrowRight size={16} className="ml-2" /></Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">Ví dụ: &quot;Giải thích vì sao máy tính Windows bị chậm...&quot;</div>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-xl">
              <div className="bg-white border border-[#E9ECF5] rounded-2xl p-3 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 grid place-items-center text-orange-600"><Layers size={16} /></div>
                <div><div className="text-sm font-medium">Đa dạng phong cách</div><div className="text-xs text-gray-500">Hoạt hình, thực tế, motion...</div></div>
              </div>
              <div className="bg-white border border-[#E9ECF5] rounded-2xl p-3 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 grid place-items-center text-emerald-600"><Wand2 size={16} /></div>
                <div><div className="text-sm font-medium">Tự động hoàn toàn</div><div className="text-xs text-gray-500">Lập kịch bản - tạo cảnh - ghép video</div></div>
              </div>
              <div className="bg-white border border-[#E9ECF5] rounded-2xl p-3 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 grid place-items-center text-blue-600"><Zap size={16} /></div>
                <div><div className="text-sm font-medium">Dễ sử dụng</div><div className="text-xs text-gray-500">Không cần kinh nghiệm dựng phim</div></div>
              </div>
              <div className="bg-white border border-[#E9ECF5] rounded-2xl p-3 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 grid place-items-center text-purple-600"><Clock size={16} /></div>
                <div><div className="text-sm font-medium">Tiết kiệm chi phí</div><div className="text-xs text-gray-500">Quản lý lượt tạo & chi phí rõ ràng</div></div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#DDD6FE] rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-10 -left-6 w-56 h-56 bg-[#FFD6C8] rounded-full blur-3xl opacity-50" />
            <Card className="relative overflow-hidden p-3">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[16/10]">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 grid place-items-center shadow"><Play size={20} className="fill-gray-900 text-gray-900 ml-0.5" /></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur">Video mẫu</span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-gray-900 text-xs font-medium">00:12 / 01:30</span>
                </div>
              </div>
              <div className="absolute -right-2 top-16 bg-white border border-[#E9ECF5] rounded-2xl px-3 py-2 shadow-card text-xs rotate-2">
                <div className="font-medium">Tự động</div><div className="text-gray-500">từ ý tưởng đến video thật<br />chỉ trong vài phút!</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Process */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quy trình tạo video</h3>
            <Badge tone="purple">5 bước • 2-5 phút</Badge>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-3 text-center">
            {[
              { n: 1, t: "Nhập ý tưởng", d: "Chủ đề, mô tả ngắn" },
              { n: 2, t: "AI viết kịch bản", d: "Lập dàn ý, phân cảnh" },
              { n: 3, t: "Duyệt storyboard", d: "Sửa cảnh, prompt" },
              { n: 4, t: "Tạo video", d: "Render từng cảnh + voice" },
              { n: 5, t: "Xuất MP4", d: "Tải về & chia sẻ" },
            ].map(s => (
              <div key={s.n} className="bg-[#F9FAFF] border border-[#E9ECF5] rounded-2xl p-3">
                <div className="w-7 h-7 rounded-full bg-[#7C5BFF] text-white grid place-items-center text-xs font-bold mx-auto">{s.n}</div>
                <div className="text-sm font-medium mt-2">{s.t}</div>
                <div className="text-xs text-gray-500">{s.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { label: "Hoạt hình", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" },
              { label: "Người thật", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400" },
              { label: "Motion Graphics", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400" },
              { label: "Cinematic", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
            ].map(c => (
              <div key={c.label} className="rounded-2xl overflow-hidden border border-[#E9ECF5] bg-white">
                <img src={c.img} alt="" className="h-20 w-full object-cover" />
                <div className="p-2 text-xs font-medium text-center">{c.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <footer className="py-10 text-center text-xs text-gray-500">© 2026 NMH AI Video Studio • Demo mode • Không lưu API key ở frontend</footer>
      </div>
    </div>
  );
}
