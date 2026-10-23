"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, Button, Label, Input, Select, Badge } from "@/components/ui";
import { StudioSteps } from "@/components/StudioLayout";
import { useState } from "react";
import { generateMockScript, enrichScenesWithThumbs } from "@/lib/mockAI";

const contentStyles = ["Documentary", "Animation", "POV", "Motion Graphics", "Cinematic", "Storytelling"] as const;
const visualStyles = [
  { id: "3D Cute", label: "Hoạt hình 3D dễ thương", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200" },
  { id: "2D Animation", label: "Hoạt hình 2D", thumb: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200" },
  { id: "Photorealistic", label: "Người thật / Photorealistic", thumb: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200" },
  { id: "3D Semi-real", label: "Hoạt hình 3D bán chân thực", thumb: "https://images.unsplash.com/photo-1578632292335-df3ab3100d00?w=200" },
  { id: "Vector", label: "Vector / Flat Design", thumb: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200" },
  { id: "Stop Motion", label: "Stop Motion / Đất nặn", thumb: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200" },
  { id: "Pastel 2.5D", label: "Pastel 2.5D Kinetic", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200" },
];

export default function SetupPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const project = useStore(s => s.projects.find(p => p.id === params.id));
  const updateProject = useStore(s => s.updateProject);
  const [ratio, setRatio] = useState(project?.config.aspectRatio || "16:9");
  const [duration, setDuration] = useState(project?.config.duration || 1);
  const [resolution, setResolution] = useState(project?.config.resolution || "1080p");

  if (!project) return <div className="p-10 text-center">Không tìm thấy dự án <a href="/dashboard" className="text-[#7C5BFF] underline">Về dashboard</a></div>;

  const setContentStyle = (v: any) => updateProject(project.id, { config: { ...project.config, contentStyle: v } });
  const setVisualStyle = (v: any) => updateProject(project.id, { config: { ...project.config, visualStyle: v } });

  const generateScript = () => {
    const mock = generateMockScript(project.topic);
    const scenes = enrichScenesWithThumbs(mock.scenes);
    updateProject(project.id, {
      script: { objective: mock.objective, scenesOutline: mock.scenesOutline, fullScript: mock.fullScript },
      scenes,
      status: "storyboard",
      progress: 35,
      config: { ...project.config, aspectRatio: ratio as any, duration, resolution: resolution as any },
    });
    router.push(`/projects/${project.id}/script`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Thiết lập video</h1>
        <p className="text-sm text-gray-500">Chọn phong cách, tỉ lệ và các thông số phù hợp với khả năng AI.</p>
      </div>

      <StudioSteps projectId={project.id} current={2} />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="p-5">
          <h3 className="font-semibold">Phong cách nội dung</h3>
          <p className="text-xs text-gray-500">Chọn 1 phong cách mô tả cách kể chuyện</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {contentStyles.map(s => (
              <button key={s} onClick={() => setContentStyle(s)} className={`p-3 rounded-2xl border text-left ${project.config.contentStyle === s ? "border-[#7C5BFF] bg-[#F5F3FF]" : "border-[#E9ECF5] bg-white hover:bg-gray-50"}`}>
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] grid place-items-center text-[#7C5BFF] text-sm">◈</div>
                <div className="text-sm font-medium mt-2">{s}</div>
                <div className="text-[11px] text-gray-500">Phù hợp cho {s.toLowerCase()}</div>
              </button>
            ))}
          </div>

          <h3 className="font-semibold mt-6">Phong cách hình ảnh</h3>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {visualStyles.map(v => (
              <button key={v.id} onClick={() => setVisualStyle(v.id)} className={`rounded-2xl overflow-hidden border ${project.config.visualStyle === v.id ? "border-[#7C5BFF] ring-2 ring-[#7C5BFF]/20" : "border-[#E9ECF5]"}`}>
                <img src={v.thumb} alt="" className="h-16 w-full object-cover" />
                <div className="p-2 text-[11px] font-medium leading-tight">{v.label}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <h3 className="font-semibold">Thông số video</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Tỉ lệ khung hình</Label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {["16:9", "9:16", "1:1"].map(r => (
                  <button key={r} onClick={() => setRatio(r as any)} className={`py-2.5 rounded-xl border text-sm font-medium ${ratio === r ? "bg-[#7C5BFF] text-white border-[#7C5BFF]" : "bg-white border-[#E9ECF5]"}`}>{r} {r === "16:9" ? "(Ngang)" : r === "9:16" ? "(Dọc)" : "(Vuông)"}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Thời lượng</Label>
              <Select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={1}>1 phút</option>
                <option value={2}>1.5 - 2 phút</option>
                <option value={3}>2-3 phút</option>
              </Select>
            </div>
            <div>
              <Label>Độ phân giải</Label>
              <Select value={resolution} onChange={e => setResolution(e.target.value as any)}>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4K">4K (Pro)</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Ngôn ngữ</Label><Select defaultValue="vi-VN"><option>Tiếng Việt</option><option>English</option></Select></div>
              <div><Label>Giọng đọc</Label><Select defaultValue="female-warm"><option>Nữ ấm áp</option><option>Nam trầm</option></Select></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFF] border border-[#E9ECF5]"><span className="text-sm">Nhạc nền</span><span className="px-3 py-1 rounded-full bg-[#7C5BFF] text-white text-xs">Bật</span></div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFF] border border-[#E9ECF5]"><span className="text-sm">Phụ đề</span><span className="px-3 py-1 rounded-full bg-[#7C5BFF] text-white text-xs">Bật (CC)</span></div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">Demo mode: Tạo ảnh/video/giọng đọc sẽ dùng dữ liệu mẫu. Khi bật Live, cấu hình này sẽ khớp với khả năng provider thật.</div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => router.push("/dashboard")}>Quay lại</Button>
            <Button className="flex-1" onClick={generateScript}>Tạo kịch bản AI →</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
