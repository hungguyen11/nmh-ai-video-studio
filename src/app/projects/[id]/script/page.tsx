"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Textarea, Label, Modal, useToast } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Copy, Check, Wand2, FileText, Save } from "lucide-react";
import { generateMockScript, enrichScenesWithThumbs } from "@/lib/mockAI";

export default function ScriptPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const [full, setFull] = useState(project?.script?.fullScript || "");
  const [objective, setObjective] = useState(project?.script?.objective || "");
  const [showRegen, setShowRegen] = useState(false);
  const [regenTopic, setRegenTopic] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast, ToastContainer } = useToast();

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;
  if (!project.script) {
    return <div className="p-10 text-center"><Card className="p-8 max-w-md mx-auto"><p>Chưa có kịch bản.</p><Button className="mt-4" onClick={()=>router.push(`/projects/${project.id}/setup`)}>Quay lại thiết lập</Button></Card></div>;
  }

  const save = () => {
    updateProject(project.id, { script: { ...project.script!, fullScript: full, objective }, progress: 45 });
    toast("Đã lưu kịch bản! Chuyển tới storyboard...","success");
    setTimeout(()=> router.push(`/projects/${project.id}/storyboard`), 600);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(full);
    setCopied(true); toast("Đã sao chép kịch bản","success");
    setTimeout(()=>setCopied(false), 2000);
  };

  const regen = () => {
    const t = regenTopic || project.topic;
    const mock = generateMockScript(t);
    const scenes = enrichScenesWithThumbs(mock.scenes);
    updateProject(project.id, { script: { objective: mock.objective, scenesOutline: mock.scenesOutline, fullScript: mock.fullScript }, scenes, progress: 35 });
    setFull(mock.fullScript); setObjective(mock.objective);
    setShowRegen(false);
    toast("Đã tạo lại kịch bản mới!","success");
  };

  return (
    <div className="space-y-6">
      <StudioSteps projectId={project.id} current={3} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold flex items-center gap-2"><FileText size={20} className="text-[#7C5BFF]" /> Kịch bản AI — {project.title}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={copyAll} className="hover:bg-gray-50">{copied ? <Check size={14} className="mr-1 text-emerald-600" /> : <Copy size={14} className="mr-1" />}{copied ? "Đã copy" : "Sao chép"}</Button>
          <Button variant="subtle" onClick={()=>setShowRegen(true)}><RefreshCw size={14} className="mr-1" /> Tạo lại</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-[#7C5BFF]" /> Mục tiêu & thông điệp</h3>
            <p className="text-xs text-gray-500 mt-1">AI phân tích chủ đề và đề xuất — bạn có thể sửa trước khi duyệt.</p>
            <Textarea value={objective} onChange={(e:any)=>setObjective(e.target.value)} rows={2} className="mt-2" placeholder="Mục tiêu video..." />

            <h3 className="font-semibold mt-6 flex items-center gap-2">Dàn ý cảnh <Badge tone="purple">{project.script.scenesOutline.length} cảnh</Badge></h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.script.scenesOutline.map((o, i) => <motion.span key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i*0.05 }} className="px-3 py-1.5 rounded-full bg-white border border-[#E9ECF5] text-xs hover:border-[#7C5BFF]/30 hover:bg-[#F5F3FF] transition cursor-pointer">{i + 1}. {o}</motion.span>)}
            </div>

            <h3 className="font-semibold mt-6 flex items-center gap-2">Kịch bản lời dẫn đầy đủ <Badge tone="green" dot>Có thể sửa</Badge></h3>
            <p className="text-xs text-gray-500">Mỗi đoạn tương ứng 1 cảnh ở storyboard. Giữ mỗi cảnh 8-18s để giọng đọc tự nhiên.</p>
            <Textarea value={full} onChange={(e:any)=>setFull(e.target.value)} rows={10} className="mt-2 font-[15px] leading-relaxed" />
            <div className="mt-2 flex justify-between text-xs text-gray-500"><span>{full.length} ký tự • ~{Math.ceil(full.length/6)}s đọc</span><span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Đã lưu tự động</span></div>
            <div className="mt-1 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">Với nội dung thông tin, hãy kiểm chứng số liệu quan trọng trước khi xuất bản. AI phân biệt dữ kiện đã xác minh và giả định sáng tạo.</div>

            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => router.push(`/projects/${project.id}/setup`)}>Quay lại</Button>
              <Button onClick={save} className="shadow-md"><Save size={14} className="mr-2" /> Lưu & xem Storyboard →</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5 sticky top-[88px]">
            <h3 className="font-semibold">Cấu hình đã chọn</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border hover:bg-white transition"><span className="text-gray-500">Nội dung</span><b className="text-[#7C5BFF]">{project.config.contentStyle}</b></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border hover:bg-white transition"><span className="text-gray-500">Hình ảnh</span><b>{project.config.visualStyle}</b></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border hover:bg-white transition"><span className="text-gray-500">Tỉ lệ</span><b>{project.config.aspectRatio}</b></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border hover:bg-white transition"><span className="text-gray-500">Thời lượng</span><b>{project.config.duration} phút</b></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border hover:bg-white transition"><span className="text-gray-500">Độ phân giải</span><b>{project.config.resolution}</b></div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#EDE9FE] to-[#FFF7ED] border border-[#E9ECF5]">
              <b className="text-sm flex items-center gap-1"><Wand2 size={12} className="text-[#7C5BFF]" /> Gợi ý AI:</b>
              <p className="text-xs text-gray-600 mt-1">Giữ lời dẫn mỗi cảnh 8-18s. Câu ngắn, rõ chủ ngữ vị ngữ. Thêm từ khóa cảm xúc để giọng đọc tự nhiên hơn.</p>
              <Button size="sm" variant="subtle" className="mt-2 w-full" onClick={()=>{ toast("Đang tối ưu lời dẫn...","info"); setTimeout(()=>{ setFull(full + " (đã tối ưu)"); toast("Đã tối ưu!","success"); }, 900); }}><Wand2 size={12} className="mr-1" /> Tối ưu lời dẫn</Button>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-gray-900 text-white text-xs">
              <div className="font-medium">Chi phí ước tính (Demo)</div>
              <div className="mt-1 flex justify-between"><span>Kịch bản</span><span className="font-bold">0đ</span></div>
              <div className="flex justify-between"><span>5 cảnh × ảnh</span><span>0đ</span></div>
              <div className="flex justify-between"><span>Voice</span><span>0đ</span></div>
              <div className="border-t border-white/20 mt-2 pt-2 flex justify-between font-bold"><span>Tổng</span><span className="text-emerald-400">Miễn phí</span></div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Modal open={showRegen} onClose={()=>setShowRegen(false)} title="Tạo lại kịch bản" size="md">
        <p className="text-sm text-gray-600">Nhập chủ đề mới hoặc để trống để tạo lại từ chủ đề hiện tại. Kịch bản cũ sẽ được thay thế.</p>
        <Textarea value={regenTopic} onChange={(e:any)=>setRegenTopic(e.target.value)} placeholder={`Chủ đề hiện tại: ${project.topic}`} rows={3} className="mt-3" />
        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={()=>setShowRegen(false)}>Hủy</Button><Button onClick={regen}><Wand2 size={14} className="mr-1" /> Tạo lại</Button></div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
