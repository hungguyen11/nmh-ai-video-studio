"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("minh@nmh.studio");
  const [password, setPassword] = useState("123456");
  const login = useStore(s => s.login);
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-[#EDE9FE] via-white to-[#FFF7ED] border-r border-[#E9ECF5]">
        <div className="max-w-md mx-auto">
          <div className="w-10 h-10 rounded-xl bg-[#7C5BFF] grid place-items-center text-white font-bold">M</div>
          <h1 className="text-[28px] font-bold leading-tight mt-6">Tạo video tuyệt vời<br />chỉ trong vài bước</h1>
          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li className="flex gap-2"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs">✓</span> Tạo video chất lượng cao</li>
            <li className="flex gap-2"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs">✓</span> Nhiều phong cách & mẫu có sẵn</li>
            <li className="flex gap-2"><span className="w-6 h-6 rounded-full bg-white border grid place-items-center text-xs">✓</span> Quản lý dự án, lưu trữ an toàn</li>
          </ul>
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" alt="" className="mt-8 rounded-2xl border border-white shadow-card w-full object-cover h-48" />
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#F6F7FB]">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-xl font-semibold">Đăng nhập</h2>
          <p className="text-sm text-gray-500 mt-1">Chào mừng trở lại!</p>
          <div className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e:any) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <Label>Mật khẩu</Label>
              <Input type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={() => { login(email, "Nguyễn Minh"); router.push("/dashboard"); }}>Đăng nhập</Button>
            <div className="text-center text-sm text-gray-500">Hoặc đăng nhập với</div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 rounded-xl border border-[#E9ECF5] bg-white text-sm font-medium flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" /> Google</button>
              <button className="py-2.5 rounded-xl border border-[#E9ECF5] bg-white text-sm font-medium flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" /> Facebook</button>
            </div>
            <div className="text-center text-sm">Chưa có tài khoản? <Link href="/register" className="text-[#7C5BFF] font-medium">Đăng ký</Link></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
