"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...a: (string | false | null | undefined)[]) { return twMerge(clsx(a)); }

export function Button({ variant = "primary", size = "md", className, children, ...props }: any) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-[#7C5BFF] hover:bg-[#6B4EFF] text-white shadow-sm",
    ghost: "bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700",
    subtle: "bg-[#EDE9FE] text-[#7C5BFF] hover:bg-[#DDD6FE]",
    outline: "border border-[#7C5BFF] text-[#7C5BFF] hover:bg-[#F5F3FF]",
  };
  const sizes: any = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-[14px]", lg: "px-6 py-3 text-[15px]" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}
export function Card({ className, children, ...props }: any) {
  return <div className={cn("bg-white rounded-2xl border border-[#E9ECF5] shadow-card", className)} {...props}>{children}</div>;
}
export function Badge({ tone = "gray", children, className }: any) {
  const tones: any = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    purple: "bg-[#EDE9FE] text-[#7C5BFF] border border-[#DDD6FE]",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", tones[tone], className)}>{children}</span>;
}
export function Input(props: any) { return <input {...props} className={cn("input", props.className)} />; }
export function Textarea(props: any) { return <textarea {...props} className={cn("input min-h-[96px] resize-none", props.className)} />; }
export function Select({ children, ...props }: any) { return <select {...props} className={cn("input pr-8", props.className)}>{children}</select>; }
export function Label({ children, ...props }: any) { return <label className="text-[13px] font-medium text-gray-700" {...props}>{children}</label>; }
export function Progress({ value }: { value: number }) {
  return <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#7C5BFF] transition-all" style={{ width: `${value}%` }} /></div>;
}
export function Empty({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return <div className="text-center py-12"><div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#7C5BFF] text-xl mb-3">◌</div><div className="font-medium">{title}</div>{desc && <div className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{desc}</div>}{action && <div className="mt-4">{action}</div>}</div>;
}
