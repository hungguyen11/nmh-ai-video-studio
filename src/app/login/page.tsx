"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, useToast } from "@/components/ui";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("minh@nmh.studio");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useStore(s => s.login);
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

  const handleLogin = () => {
    if (!email.includes("@")) { toast("Email không hợp lệ","error"); return; }
    if (password.length < 3) { toast("Mật khẩu quá ngắn","error"); return; }
    setLoading(true);
    setTimeout(()=> {
      login(email, "Nguyễn Minh");
      toast("Đăng nhập thành công!","success");
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-[#EDE9FE] via-white to-[#FFF7ED] border-r border-[#E9ECF5] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#DDD6FE] rounded-full blur-3xl opacity-40" />
        <div className="max-w-md mx-auto relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-10 h-10 rounded-xl bg-[#7C5BFF] grid place-items-center text-white font-bold shadow-md">M</motion.div>
          <h1 className="text-[28px] font-bold leading-tight mt-6">Tạo video tuyệt vời<br />chỉ trong vài bước</h1>
          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li className="flex gap-2 items-center"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs shadow-sm">✓</span> Tạo video chất lượng cao — 1080p, 4K</li>
            <li className="flex gap-2 items-center"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs shadow-sm">✓</span> Nhiều phong cách & mẫu có sẵn</li>
            <li className="flex gap-2 items-center"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs shadow-sm">✓</span> Quản lý dự án, lưu trữ an toàn</li>
          </ul>
          <motion.img initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" alt="" className="mt-8 rounded-2xl border border-white shadow-card w-full object-cover h-48" />
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#F6F7FB]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold">Đăng nhập</h2>
            <p className="text-sm text-gray-500 mt-1">Chào mừng trở lại! Mọi dự án của bạn vẫn ở đây.</p>
            <div className="mt-6 space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e:any)=>setEmail(e.target.value)} placeholder="you@company.com" className="mt-1" />
              </div>
              <div>
                <Label>Mật khẩu</Label>
                <div className="relative mt-1">
                  <Input type={show ? "text" : "password"} value={password} onChange={(e:any)=>setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
                  <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="text-right mt-1"><button onClick={()=>toast("Đã gửi link reset (demo)","info")} className="text-xs text-[#7C5BFF] hover:underline">Quên mật khẩu?</button></div>
              </div>
              <Button className="w-full shadow-md" loading={loading} onClick={handleLogin}>Đăng nhập</Button>
              <div className="text-center text-sm text-gray-500 flex items-center gap-2"><span className="flex-1 h-px bg-gray-200" /> Hoặc đăng nhập với <span className="flex-1 h-px bg-gray-200" /></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>toast("Đã đăng nhập với Google (demo)","success")} className="py-2.5 rounded-xl border border-[#E9ECF5] bg-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:shadow-sm transition"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" /> Google</button>
                <button onClick={()=>toast("Đã đăng nhập với Facebook (demo)","success")} className="py-2.5 rounded-xl border border-[#E9ECF5] bg-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50"><img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="" /> Facebook</button>
              </div>
              <div className="text-center text-sm">Chưa có tài khoản? <Link href="/register" className="text-[#7C5BFF] font-medium hover:underline">Đăng ký</Link> • <Link href="/dashboard" className="text-gray-500 hover:text-[#7C5BFF]">Vào demo</Link></div>
            </div>
          </Card>
          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1"><Sparkles size={12} className="text-[#7C5BFF]" /> Demo: dùng email bất kỳ để đăng nhập, không cần mật khẩu thật.</p>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
}
