"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Textarea, Label, Badge, Modal, useToast } from "@/components/ui";
import { useStore } from "@/lib/store";
import { Lightbulb, Wand2, ArrowRight, Sparkles, Upload, FileText, Mic } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  "Giải thích vì sao máy tính Windows bị chậm và cách khắc phục trong 1 phút",
  "Khám phá hố đen vũ trụ cho người mới bắt đầu",
  "Du lịch Đà Nẵng: 5 địa điểm không thể bỏ lỡ",
  "Giải thích AI tạo video hoạt hình cho trẻ em",
  "Lịch sử Chiến thắng Điện Biên Phủ — kể cho học sinh lớp 5",
];

export default function NewProjectPage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"auto" | "controlled">("controlled");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const createProject = useStore(s => s.createProject);
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

  const create = () => {
    if (!topic.trim()) { toast("Vui lòng nhập chủ đề", "error"); return; }
    const id = createProject(topic.trim());
    toast("Đã tạo dự án! Chuyển tới thiết lập...", "success");
    setTimeout(()=> router.push(`/projects/${id}/setup`), 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Tạo dự án mới</h1>
        <p className="text-sm text-gray-500 mt-1">Nhập ý tưởng — AI sẽ giúp bạn tạo kịch bản, storyboard và video. Mọi thao tác đều được lưu tự động.</p>
      </motion.div>

      <Card className="p-6">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-[#EDE9FE] grid place-items-center text-[#7C5BFF]"><Lightbulb size={16} /></div><h3 className="font-semibold">Bước 1: Nhập ý tưởng</h3><Badge tone="purple" dot>Tự động + Có kiểm soát</Badge></div>

        <div className="mt-6">
          <Label required>Chủ đề / Mô tả / Kịch bản có sẵn</Label>
          <Textarea value={topic} onChange={(e:any)=>setTopic(e.target.value)} placeholder="Ví dụ: Giải thích vì sao máy tính Windows bị chậm và cách khắc phục..." rows={4} className="mt-1" />
          <div className="flex justify-between mt-1"><span className="text-xs text-gray-500">{topic.length} ký tự • Mẹo: mô tả rõ mục tiêu, đối tượng, tông giọng.</span><button onClick={()=>setShowImport(true)} className="text-xs text-[#7C5BFF] font-medium hover:underline flex items-center gap-1"><Upload size={12} /> Nhập từ file/kịch bản</button></div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2 flex items-center gap-1"><Sparkles size={14} className="text-[#7C5BFF]" /> Gợi ý nhanh</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => <motion.button key={s} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setTopic(s); toast("Đã chọn gợi ý","success"); }} className="text-xs px-3 py-2 rounded-full border border-[#E9ECF5] bg-[#F9FAFF] hover:bg-white hover:shadow-sm hover:border-[#7C5BFF]/30 text-left max-w-full transition">{s}</motion.button>)}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setMode("auto")} className={`p-4 rounded-2xl border text-left transition ${mode === "auto" ? "border-[#7C5BFF] bg-[#F5F3FF] shadow-sm" : "border-[#E9ECF5] bg-white hover:border-gray-300"}`}>
            <div className="font-medium flex items-center gap-2"><Wand2 size={16} className="text-[#7C5BFF]" /> Tự động</div>
            <div className="text-xs text-gray-500 mt-1">Hệ thống làm liên tục, bạn duyệt kết quả cuối. Nhanh nhất.</div>
            {mode==="auto" && <div className="mt-2 text-xs px-2 py-1 rounded-full bg-[#7C5BFF] text-white inline-block">Đã chọn</div>}
          </motion.button>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setMode("controlled")} className={`p-4 rounded-2xl border text-left transition ${mode === "controlled" ? "border-[#7C5BFF] bg-[#F5F3FF] shadow-sm" : "border-[#E9ECF5] bg-white hover:border-gray-300"}`}>
            <div className="font-medium flex items-center gap-2"><FileText size={16} className="text-emerald-600" /> Có kiểm soát</div>
            <div className="text-xs text-gray-500 mt-1">Duyệt kịch bản & từng giai đoạn. Chất lượng cao nhất. Khuyên dùng.</div>
            {mode==="controlled" && <div className="mt-2 text-xs px-2 py-1 rounded-full bg-emerald-500 text-white inline-block">Khuyên dùng</div>}
          </motion.button>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>Hủy</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={()=>{ setTopic(suggestions[Math.floor(Math.random()*suggestions.length)]); toast("Đã chọn ngẫu nhiên","info"); }}>Ngẫu nhiên</Button>
            <Button onClick={create} disabled={!topic.trim()} className="shadow-md">Tiếp tục <ArrowRight size={16} className="ml-2" /></Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-[#EDE9FE] to-[#FFF7ED] border-dashed">
        <div className="text-sm font-medium flex items-center gap-2"><Mic size={14} /> Mẹo để có video hay:</div>
        <ul className="text-sm text-gray-600 list-disc ml-5 mt-2 space-y-1">
          <li>Nêu rõ đối tượng (học sinh, dân văn phòng...).</li>
          <li>Chọn phong cách nội dung phù hợp ở bước tiếp theo.</li>
          <li>Bạn có thể dán cả kịch bản có sẵn — AI sẽ tự tách cảnh.</li>
          <li>Thử nhấn <b>Ngẫu nhiên</b> để khám phá ý tưởng mới.</li>
        </ul>
      </Card>

      <Modal open={showImport} onClose={()=>setShowImport(false)} title="Nhập kịch bản có sẵn" size="lg">
        <p className="text-sm text-gray-600">Dán kịch bản, tài liệu hoặc outline — AI sẽ phân tích và tạo storyboard ngay.</p>
        <Textarea value={importText} onChange={(e:any)=>setImportText(e.target.value)} placeholder="Dán nội dung ở đây... Hỗ trợ văn bản, URL, transcript..." rows={6} className="mt-3" />
        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setShowImport(false)}>Đóng</Button><Button onClick={()=>{ if(!importText.trim()) { toast("Vui lòng dán nội dung","error"); return; } setTopic(importText); setShowImport(false); toast("Đã nhập kịch bản","success"); }}>Sử dụng nội dung này</Button></div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
