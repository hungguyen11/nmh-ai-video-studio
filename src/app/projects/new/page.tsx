"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Textarea, Input, Label, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import { Lightbulb, Wand2, ArrowRight } from "lucide-react";

const suggestions = [
  "Giải thích vì sao máy tính Windows bị chậm và cách khắc phục trong 1 phút",
  "Khám phá hố đen vũ trụ cho người mới bắt đầu",
  "Du lịch Đà Nẵng: 5 địa điểm không thể bỏ lỡ",
  "Giải thích AI tạo video hoạt hình cho trẻ em",
];

export default function NewProjectPage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"auto" | "controlled">("controlled");
  const createProject = useStore(s => s.createProject);
  const router = useRouter();

  const create = () => {
    if (!topic.trim()) return;
    const id = createProject(topic.trim());
    router.push(`/projects/${id}/setup`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tạo dự án mới</h1>
        <p className="text-sm text-gray-500">Nhập ý tưởng — AI sẽ giúp bạn tạo kịch bản, storyboard và video.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2"><Lightbulb className="text-[#7C5BFF]" size={18} /><h3 className="font-semibold">Bước 1: Nhập ý tưởng</h3><Badge tone="purple">Tự động + Có kiểm soát</Badge></div>

        <div className="mt-6">
          <Label>Chủ đề / Mô tả / Kịch bản có sẵn</Label>
          <Textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ví dụ: Giải thích vì sao máy tính Windows bị chậm và cách khắc phục..." rows={4} />
          <div className="text-xs text-gray-500 mt-1">{topic.length} ký tự • Gợi ý: mô tả rõ mục tiêu, đối tượng xem, tông giọng mong muốn.</div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Gợi ý nhanh</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => <button key={s} onClick={() => setTopic(s)} className="text-xs px-3 py-2 rounded-full border border-[#E9ECF5] bg-[#F9FAFF] hover:bg-white text-left max-w-full">{s}</button>)}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => setMode("auto")} className={`p-4 rounded-2xl border text-left ${mode === "auto" ? "border-[#7C5BFF] bg-[#F5F3FF]" : "border-[#E9ECF5] bg-white"}`}>
            <div className="font-medium flex items-center gap-2"><Wand2 size={16} /> Tự động</div>
            <div className="text-xs text-gray-500 mt-1">Hệ thống thực hiện các bước liên tiếp, bạn duyệt kết quả cuối.</div>
          </button>
          <button onClick={() => setMode("controlled")} className={`p-4 rounded-2xl border text-left ${mode === "controlled" ? "border-[#7C5BFF] bg-[#F5F3FF]" : "border-[#E9ECF5] bg-white"}`}>
            <div className="font-medium">Có kiểm soát</div>
            <div className="text-xs text-gray-500 mt-1">Duyệt kịch bản & từng giai đoạn trước khi tiếp tục. Khuyên dùng.</div>
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>Hủy</Button>
          <Button onClick={create} disabled={!topic.trim()}>Tiếp tục <ArrowRight size={16} className="ml-2" /></Button>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-[#EDE9FE] to-[#FFF7ED] border-dashed">
        <div className="text-sm font-medium">Mẹo để có video hay:</div>
        <ul className="text-sm text-gray-600 list-disc ml-5 mt-1 space-y-1">
          <li>Nêu rõ đối tượng người xem (học sinh, dân văn phòng...).</li>
          <li>Chọn phong cách nội dung phù hợp ở bước tiếp theo.</li>
          <li>Bạn có thể dán kịch bản có sẵn — AI sẽ tự tách cảnh.</li>
        </ul>
      </Card>
    </div>
  );
}
