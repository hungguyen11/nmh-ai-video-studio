"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const login = useStore(s => s.login);
  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-[#EDE9FE] via-white to-[#FFF7ED] border-r border-[#E9ECF5]">
        <div className="max-w-md mx-auto">
          <div className="w-10 h-10 rounded-xl bg-[#7C5BFF] grid place-items-center text-white font-bold">M</div>
          <h1 className="text-[28px] font-bold leading-tight mt-6">Tạo video tuyệt vời<br />chỉ trong vài bước</h1>
          <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600" className="mt-8 rounded-2xl border border-white shadow-card w-full object-cover h-48" alt="" />
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#F6F7FB]">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-xl font-semibold">Đăng ký tài khoản</h2>
          <p className="text-sm text-gray-500 mt-1">Bắt đầu hành trình sáng tạo video của bạn</p>
          <div className="mt-6 space-y-4">
            <div><Label>Họ và tên</Label><Input value={name} onChange={(e:any) => setName(e.target.value)} placeholder="Nguyễn Văn A" /></div>
            <div><Label>Email</Label><Input value={email} onChange={(e:any) => setEmail(e.target.value)} placeholder="you@company.com" /></div>
            <div><Label>Mật khẩu</Label><Input type="password" placeholder="••••••••" /></div>
            <Button className="w-full" onClick={() => { login(email || "new@nmh.studio", name || "Người dùng mới"); router.push("/dashboard"); }}>Đăng ký</Button>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 rounded-xl border bg-white text-sm flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" /> Google</button>
              <button className="py-2.5 rounded-xl border bg-white text-sm flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" /> Facebook</button>
            </div>
            <div className="text-center text-sm">Đã có tài khoản? <Link href="/login" className="text-[#7C5BFF] font-medium">Đăng nhập</Link></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
