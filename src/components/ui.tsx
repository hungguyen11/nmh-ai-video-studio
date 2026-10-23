"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function cn(...a: (string | false | null | undefined)[]) { return twMerge(clsx(a)); }

export function Button({ variant = "primary", size = "md", className, children, loading, ...props }: any) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants: any = {
    primary: "bg-[#7C5BFF] hover:bg-[#6B4EFF] text-white shadow-sm hover:shadow-md hover:-translate-y-px",
    ghost: "bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 hover:border-gray-300",
    subtle: "bg-[#EDE9FE] text-[#7C5BFF] hover:bg-[#DDD6FE] border border-transparent",
    outline: "border-2 border-[#7C5BFF] text-[#7C5BFF] hover:bg-[#F5F3FF] bg-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  };
  const sizes: any = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-[14px]", lg: "px-6 py-3 text-[15px]", icon: "w-9 h-9 p-0" };
  return <motion.button whileTap={{ scale: 0.97 }} className={cn(base, variants[variant], sizes[size], className)} {...props}>{loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}{children}</motion.button>;
}
export function Card({ className, children, hover, ...props }: any) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn("bg-white rounded-2xl border border-[#E9ECF5] shadow-card", hover && "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300", className)} {...props}>{children}</motion.div>;
}
export function Badge({ tone = "gray", children, className, dot }: any) {
  const tones: any = {
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    purple: "bg-[#EDE9FE] text-[#7C5BFF] border border-[#DDD6FE]",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    red: "bg-red-50 text-red-700 border border-red-200",
  };
  return <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", tones[tone], className)}>{dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}{children}</span>;
}
export function Input(props: any) { return <input {...props} className={cn("w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5BFF]/20 focus:border-[#7C5BFF] transition-all", props.className)} />; }
export function Textarea(props: any) { return <textarea {...props} className={cn("w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5BFF]/20 focus:border-[#7C5BFF] transition-all min-h-[96px] resize-none", props.className)} />; }
export function Select({ children, ...props }: any) { return <select {...props} className={cn("w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7C5BFF]/20 focus:border-[#7C5BFF] transition-all pr-8", props.className)}>{children}</select>; }
export function Label({ children, required, ...props }: any) { return <label className="text-[13px] font-medium text-gray-700 flex items-center gap-1" {...props}>{children}{required && <span className="text-red-500">*</span>}</label>; }
export function Progress({ value, className }: { value: number; className?: string }) {
  return <div className={cn("h-2 bg-gray-100 rounded-full overflow-hidden", className)}><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#7C5BFF] to-[#A78BFA] rounded-full" /></div>;
}
export function Empty({ title, desc, action, icon }: { title: string; desc?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return <div className="text-center py-12 slide-in"><div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#7C5BFF] text-xl mb-3 border border-[#EDE9FE]">{icon || "◌"}</div><div className="font-medium">{title}</div>{desc && <div className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{desc}</div>}{action && <div className="mt-4">{action}</div>}</div>;
}

// Modal with framer-motion
export function Modal({ open, onClose, title, children, size = "md" }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const sizes: any = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={cn("bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col", sizes[size])}>
              {title && <div className="px-6 py-4 border-b border-[#E9ECF5] flex items-center justify-between shrink-0"><h3 className="font-semibold">{title}</h3><button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-xl hover:bg-gray-100 transition"><X size={16} /></button></div>}
              <div className="flex-1 overflow-auto p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Confirm dialog
export function ConfirmModal({ open, onClose, onConfirm, title, desc, confirmText = "Xác nhận", variant = "danger" }: any) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600">{desc}</p>
      <div className="flex gap-2 justify-end mt-6">
        <Button variant="ghost" onClick={onClose}>Hủy</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
}

// Toast hook (simple)
export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" | "info" }[]>([]);
  const toast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 40, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }} className={cn("px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 min-w-[280px]", t.type === "success" ? "bg-emerald-500 text-white border-emerald-600" : t.type === "error" ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-800 border-gray-200")}>
            <span className="w-6 h-6 rounded-full bg-white/20 grid place-items-center text-xs shrink-0">{t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}</span>{t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
  return { toast, ToastContainer };
}
