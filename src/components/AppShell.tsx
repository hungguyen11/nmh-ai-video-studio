"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Plus, FolderClock, Video, Library, Settings, Bell, Menu, X, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects/new", label: "Tạo dự án mới", icon: Plus },
  { href: "/projects", label: "Dự án của tôi", icon: FolderClock },
  { href: "/library", label: "Video đã xuất", icon: Video },
  { href: "/resources", label: "Thư viện tài nguyên", icon: Library },
  { href: "/billing", label: "Gói dịch vụ", icon: Sparkles },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useStore(s => s.user);
  const notifications = useStore(s => s.notifications);
  const unread = notifications.filter(n => !n.read).length;
  const [mobileOpen, setMobileOpen] = useState(false);

  const hideShell = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");
  if (hideShell) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E9ECF5]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[64px] flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 5, scale: 1.05 }} className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5BFF] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm shadow-md">M</motion.div>
            <div className="hidden sm:block">
              <div className="font-semibold text-[15px] leading-none group-hover:text-[#7C5BFF] transition">NMH AI Video Studio</div>
              <div className="text-[11px] text-gray-500">Biến ý tưởng thành video</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-6">
            {nav.slice(0, 4).map(n => {
              const Icon = n.icon as any;
              const active = pathname.startsWith(n.href);
              return <Link key={n.href} href={n.href} className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${active ? "bg-[#EDE9FE] text-[#7C5BFF] shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}><Icon size={16} />{n.label}</Link>;
            })}
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2">
            <Link href="/notifications" className="relative w-9 h-9 grid place-items-center rounded-xl border border-[#E9ECF5] bg-white hover:bg-gray-50 hover:shadow-sm transition">
              <Bell size={18} />
              {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full grid place-items-center animate-pulse">{unread}</span>}
            </Link>
            <Link href="/billing" className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFF7ED] border border-orange-100 text-orange-700 text-sm font-medium hover:shadow-sm transition">
              Còn lại: <b>{user?.credits.total! - user?.credits.used!} / {user?.credits.total}</b> <span className="px-2 py-0.5 rounded-full bg-[#7C5BFF] text-white text-xs hidden sm:inline">Nâng cấp</span>
            </Link>
          </div>

          <Link href="/settings" className="flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-xl pr-2 py-1 transition">
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#EDE9FE]" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium leading-none">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </Link>

          <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden w-9 h-9 grid place-items-center rounded-xl border bg-white hover:bg-gray-50"><Menu size={18} /></button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="lg:hidden fixed right-0 top-0 bottom-0 w-[86%] max-w-sm bg-white z-50 p-4 overflow-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4"><span className="font-semibold">Menu</span><button onClick={() => setMobileOpen(false)} className="w-8 h-8 grid place-items-center rounded-xl hover:bg-gray-100 border"><X size={16} /></button></div>
              <nav className="grid gap-1">
                {nav.map(n => {
                  const Icon = n.icon as any;
                  return <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 font-medium"><Icon size={18} />{n.label}</Link>;
                })}
              </nav>
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#FFF7ED] border">
                <div className="font-semibold text-sm">Gói Miễn phí</div>
                <div className="text-xs text-gray-600 mt-1">Nâng cấp để tạo không giới hạn, 4K, API riêng.</div>
                <Link href="/billing" onClick={() => setMobileOpen(false)} className="mt-3 block text-center bg-[#7C5BFF] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#6B4EFF]">Xem gói Pro</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 flex gap-6">
        <aside className="hidden lg:block w-[230px] shrink-0">
          <div className="sticky top-[88px] bg-white rounded-2xl border border-[#E9ECF5] p-3 shadow-sm">
            <nav className="grid gap-1">
              {nav.map(n => {
                const Icon = n.icon as any;
                const active = pathname === n.href || pathname.startsWith(n.href + "/");
                return <Link key={n.href} href={n.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-[#7C5BFF] text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}><Icon size={18} /><span>{n.label}</span></Link>;
              })}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#7C5BFF] to-[#A78BFA] text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 rounded-full blur-xl" />
              <div className="relative">
                <div className="text-sm font-semibold flex items-center gap-1.5"><Sparkles size={14} /> Nâng cấp Pro</div>
                <div className="text-xs text-white/90 mt-1">Tạo 100 video/tháng, 1080p, không watermark.</div>
                <Link href="/billing" className="mt-3 inline-flex w-full justify-center bg-white text-[#7C5BFF] rounded-xl py-2 text-sm font-bold hover:bg-gray-50 transition">Xem gói Pro →</Link>
              </div>
            </motion.div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
