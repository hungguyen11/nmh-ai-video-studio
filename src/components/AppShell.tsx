"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Plus, FolderClock, Video, Library, Settings, Bell, Search, Menu, X, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // hide shell on landing & auth
  const hideShell = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");
  if (hideShell) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#E9ECF5]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[64px] flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C5BFF] flex items-center justify-center text-white font-bold text-sm">M</div>
            <div className="hidden sm:block">
              <div className="font-semibold text-[15px] leading-none">NMH AI Video Studio</div>
              <div className="text-[11px] text-gray-500">Biến ý tưởng thành video</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-6">
            {nav.slice(0, 4).map(n => {
              const Icon = n.icon as any;
              const active = pathname.startsWith(n.href);
              return <Link key={n.href} href={n.href} className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${active ? "bg-[#EDE9FE] text-[#7C5BFF]" : "text-gray-600 hover:bg-gray-50"}`}><Icon size={16} />{n.label}</Link>;
            })}
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2">
            <Link href="/notifications" className="w-9 h-9 grid place-items-center rounded-xl border border-[#E9ECF5] bg-white hover:bg-gray-50"><Bell size={18} /></Link>
            <Link href="/billing" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF7ED] border border-orange-100 text-orange-700 text-sm font-medium">Lượt tạo còn lại: <b>8 / 20</b> <span className="px-2 py-0.5 rounded-full bg-[#7C5BFF] text-white text-xs">Nâng cấp</span></Link>
          </div>

          <Link href="/settings" className="flex items-center gap-2 pl-2">
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium leading-none">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </Link>

          <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden w-9 h-9 grid place-items-center rounded-xl border bg-white"><Menu size={18} /></button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-white p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4"><span className="font-semibold">Menu</span><button onClick={() => setMobileOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg border"><X size={16} /></button></div>
            <nav className="grid gap-1">
              {nav.map(n => {
                const Icon = n.icon as any;
                return <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50"><Icon size={18} />{n.label}</Link>;
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-[220px] shrink-0">
          <div className="sticky top-[88px] bg-white rounded-2xl border border-[#E9ECF5] p-3 shadow-sm">
            <nav className="grid gap-1">
              {nav.map(n => {
                const Icon = n.icon as any;
                const active = pathname === n.href || pathname.startsWith(n.href + "/") || (n.href === "/dashboard" && pathname === "/dashboard");
                return <Link key={n.href} href={n.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${active ? "bg-[#7C5BFF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}><Icon size={18} /><span>{n.label}</span></Link>;
              })}
            </nav>
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#EDE9FE] to-[#FFF7ED] border border-[#E9ECF5]">
              <div className="text-sm font-semibold">Bạn đang dùng gói Miễn phí</div>
              <div className="text-xs text-gray-600 mt-1">Nâng cấp để tạo không giới hạn, 4K và API riêng.</div>
              <Link href="/billing" className="mt-3 inline-flex w-full justify-center bg-[#7C5BFF] text-white rounded-xl py-2 text-sm font-medium">Xem gói Pro</Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
