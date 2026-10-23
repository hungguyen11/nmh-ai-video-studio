"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge } from "./ui";
export function StudioSteps({ projectId, current }: { projectId: string; current: number }) {
  const steps = [
    { label: "Nhập ý tưởng", href: `/projects/${projectId}/setup` },
    { label: "Thiết lập video", href: `/projects/${projectId}/setup?tab=setup` },
    { label: "Lập kế hoạch (AI)", href: `/projects/${projectId}/script` },
    { label: "Storyboard", href: `/projects/${projectId}/storyboard` },
    { label: "Tạo video", href: `/projects/${projectId}/studio` },
    { label: "Hoàn thiện", href: `/projects/${projectId}/studio?done=1` },
  ];
  return (
    <div className="flex items-center gap-2 overflow-auto p-1">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <Link key={s.label} href={s.href} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap border ${active ? "bg-[#7C5BFF] text-white border-[#7C5BFF]" : done ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-[#E9ECF5] text-gray-600"}`}>
            <span className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${active ? "bg-white text-[#7C5BFF]" : done ? "bg-emerald-500 text-white" : "bg-gray-100"}`}>{done ? "✓" : idx}</span>
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
