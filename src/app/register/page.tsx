"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, useToast } from "@/components/ui";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useStore(s => s.login);
  const { toast, ToastContainer } = useToast();

  const handle = () => {
    if (!name) { toast("Vui lòng nhập họ tên","error"); return; }
    if (!email.includes("@")) { toast("Email không hợp lệ","error"); return; }
    if (pass.length < 6) { toast("Mật khẩu tối thiểu 6 ký tự","error"); return; }
    setLoading(true);
    setTimeout(()=>{ login(email, name); toast("Tạo tài khoản thành công!","success"); router.push("/dashboard"); }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-[#EDE9FE] via-white to-[#FFF7ED] border-r border-[#E9ECF5]">
        <div className="max-w-md mx-auto">
          <div className="w-10 h-10 rounded-xl bg-[#7C5BFF] grid place-items-center text-white font-bold shadow-md">M</div>
          <h1 className="text-[28px] font-bold leading-tight mt-6">Bắt đầu hành trình<br />sáng tạo video AI</h1>
          <p className="text-sm text-gray-600 mt-2">Tham gia 12k+ creator đang dùng NMH Studio.</p>
          <motion.img initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600" className="mt-8 rounded-2xl border border-white shadow-card w-full object-cover h-48" alt="" />
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#F6F7FB]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold">Đăng ký tài khoản</h2>
            <p className="text-sm text-gray-500 mt-1">Bắt đầu miễn phí — không cần thẻ tín dụng.</p>
            <div className="mt-6 space-y-4">
              <div><Label required>Họ và tên</Label><Input value={name} onChange={(e:any)=>setName(e.target.value)} placeholder="Nguyễn Văn A" className="mt-1" /></div>
              <div><Label required>Email</Label><Input value={email} onChange={(e:any)=>setEmail(e.target.value)} placeholder="you@company.com" className="mt-1" /></div>
              <div><Label required>Mật khẩu</Label><div className="relative mt-1"><Input type={show?"text":"password"} value={pass} onChange={(e:any)=>setPass(e.target.value)} placeholder="••••••••" className="pr-10" /><button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
              <label className="flex gap-2 text-xs text-gray-600"><input type="checkbox" className="accent-[#7C5BFF]" defaultChecked /> Tôi đồng ý <Link href="#" className="text-[#7C5BFF] underline">Điều khoản</Link> & <Link href="#" className="text-[#7C5BFF] underline">Bảo mật</Link></label>
              <Button className="w-full shadow-md" loading={loading} onClick={handle}>Đăng ký</Button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>toast("Đã đăng ký với Google","success")} className="py-2.5 rounded-xl border bg-white text-sm flex items-center justify-center gap-2 hover:bg-gray-50"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" /> Google</button>
                <button onClick={()=>toast("Đã đăng ký với Facebook","success")} className="py-2.5 rounded-xl border bg-white text-sm flex items-center justify-center gap-2 hover:bg-gray-50"><img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="" /> Facebook</button>
              </div>
              <div className="text-center text-sm">Đã có tài khoản? <Link href="/login" className="text-[#7C5BFF] font-medium hover:underline">Đăng nhập</Link></div>
            </div>
          </Card>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
}
