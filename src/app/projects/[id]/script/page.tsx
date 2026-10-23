"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Textarea, Input, Label } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState } from "react";

export default function ScriptPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const [full, setFull] = useState(project?.script?.fullScript || "");
  const [objective, setObjective] = useState(project?.script?.objective || "");

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án</div>;
  if (!project.script) {
    return <div className="p-10 text-center">Chưa có kịch bản. <a className="text-[#7C5BFF] underline" href={`/projects/${project.id}/setup`}>Quay lại thiết lập</a></div>;
  }

  const save = () => {
    updateProject(project.id, { script: { ...project.script!, fullScript: full, objective }, progress: 45 });
    router.push(`/projects/${project.id}/storyboard`);
  };

  return (
    <div className="space-y-6">
      <StudioSteps projectId={project.id} current={3} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kịch bản AI</h1>
        <Badge tone="purple">AI tạo • Có thể sửa</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <Card className="p-5">
          <h3 className="font-semibold">Mục tiêu & thông điệp</h3>
          <Textarea value={objective} onChange={e => setObjective(e.target.value)} rows={2} className="mt-2" />
          <h3 className="font-semibold mt-6">Dàn ý cảnh</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.script.scenesOutline.map((o, i) => <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-[#E9ECF5] text-xs">{i + 1}. {o}</span>)}
          </div>
          <h3 className="font-semibold mt-6">Kịch bản lời dẫn đầy đủ</h3>
          <p className="text-xs text-gray-500">Bạn có thể sửa trực tiếp. Mỗi đoạn sẽ tương ứng 1 cảnh ở storyboard.</p>
          <Textarea value={full} onChange={e => setFull(e.target.value)} rows={10} className="mt-2" />
          <div className="mt-2 text-xs text-gray-500">Nguồn: AI tổng hợp từ chủ đề & thông số đã chọn. Với nội dung mang tính thông tin, hãy kiểm chứng số liệu quan trọng trước khi xuất bản.</div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => router.push(`/projects/${project.id}/setup`)}>Quay lại</Button>
            <Button onClick={save}>Lưu & xem Storyboard →</Button>
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <h3 className="font-semibold">Cấu hình đã chọn</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border"><span className="text-gray-500">Phong cách nội dung</span><b>{project.config.contentStyle}</b></div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border"><span className="text-gray-500">Phong cách hình ảnh</span><b>{project.config.visualStyle}</b></div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border"><span className="text-gray-500">Tỉ lệ</span><b>{project.config.aspectRatio}</b></div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F9FAFF] border"><span className="text-gray-500">Thời lượng</span><b>{project.config.duration} phút</b></div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-xs">
            <b>Gợi ý:</b> Giữ lời dẫn mỗi cảnh 8-18s để AI tạo giọng đọc tự nhiên. Câu ngắn, rõ chủ ngữ vị ngữ.
          </div>
        </Card>
      </div>
    </div>
  );
}
