import { Scene } from "./types";

const thumbs = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
  "https://images.unsplash.com/photo-1555617117-2412cc56ba5d?w=800",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
];

export function generateMockScript(topic: string) {
  const lower = topic.toLowerCase();
  const isWin = lower.includes("windows") || lower.includes("máy tính") || lower.includes("chậm");
  if (isWin) {
    return {
      objective: "Giải thích nguyên nhân máy tính Windows bị chậm và hướng dẫn khắc phục chi tiết, dễ hiểu.",
      scenesOutline: ["Mở đầu gây tò mò", "Nguyên nhân phổ biến", "Cách 1: Dọn rác & tắt startup", "Cách 2: Nâng cấp phần cứng", "Kết luận & CTA"],
      fullScript: `Máy tính Windows của bạn ngày càng chậm? Đừng lo, đây là 3 nguyên nhân chính: file rác tích tụ, ứng dụng khởi động cùng hệ thống, và ổ cứng HDD đã cũ. Đầu tiên, hãy dọn dẹp Disk Cleanup và tắt bớt ứng dụng chạy nền. Tiếp theo, nếu máy vẫn chậm, hãy cân nhắc nâng cấp lên SSD và thêm RAM. Chỉ với 10 phút, máy bạn sẽ mượt mà trở lại!`,
      scenes: [
        { title: "Giới thiệu vấn đề", duration: 12, narration: "Máy tính Windows của bạn bỗng dưng chạy chậm? Đừng lo, video này sẽ giúp bạn hiểu nguyên nhân và cách khắc phục chỉ trong 1 phút!", visualPrompt: "Phụ nữ trẻ văn phòng cầm laptop, biểu cảm lo lắng, background văn phòng sáng, phong cách photorealistic, cinematic lighting", videoPrompt: "slow zoom in, subtle camera shake", camera: "Cận cảnh + Zoom nhẹ", transition: "Fade in" },
        { title: "Nguyên nhân", duration: 18, narration: "Có ba thủ phạm chính: file rác và cache tích tụ, quá nhiều ứng dụng chạy nền khi khởi động, và ổ cứng HDD truyền thống đã lỗi thời.", visualPrompt: "Minh họa 3D các file rác, icon ứng dụng chạy nền, ổ cứng HDD cũ kỹ, style infographic", videoPrompt: "pan right, parallax", camera: "Toàn cảnh", transition: "Slide" },
        { title: "Cách khắc phục 1", duration: 15, narration: "Cách 1: Dọn dẹp file tạm bằng Disk Cleanup, gỡ ứng dụng không dùng và tắt bớt ứng dụng khởi động trong Task Manager.", visualPrompt: "Màn hình Windows Disk Cleanup, Task Manager startup tab, người dùng thao tác", videoPrompt: "zoom in on screen", camera: "Trung cảnh", transition: "Cut" },
        { title: "Cách khắc phục 2", duration: 15, narration: "Cách 2: Nâng cấp lên ổ cứng SSD và bổ sung RAM. Đây là cách hiệu quả nhất để máy chạy nhanh gấp 3 lần.", visualPrompt: "So sánh HDD vs SSD, thanh RAM DDR4, kỹ thuật viên lắp ráp", videoPrompt: "dolly in, before-after split", camera: "Cận cảnh", transition: "Zoom" },
        { title: "Kết luận", duration: 10, narration: "Hãy thử ngay hôm nay và cảm nhận sự khác biệt! Nhấn theo dõi để xem thêm mẹo công nghệ hữu ích.", visualPrompt: "Người dùng mỉm cười hài lòng bên laptop chạy mượt, ánh sáng ấm áp", videoPrompt: "static, warm glow", camera: "Trung cảnh", transition: "Fade out" },
      ] as Partial<Scene>[],
    };
  }
  // generic
  return {
    objective: `Truyền đạt thông tin về "${topic}" một cách hấp dẫn, dễ hiểu.`,
    scenesOutline: ["Hook", "Bối cảnh", "Nội dung chính 1", "Nội dung chính 2", "Kết luận"],
    fullScript: `Bạn có tò mò về ${topic}? Trong video này chúng ta sẽ khám phá...`,
    scenes: [
      { title: "Mở đầu ấn tượng", duration: 10, narration: `Bạn đã bao giờ tự hỏi về ${topic}? Hôm nay chúng ta sẽ khám phá điều thú vị này!`, visualPrompt: `Concept art về ${topic}, cinematic, 8k`, videoPrompt: "slow aerial", camera: "Toàn cảnh Flycam", transition: "Fade" },
      { title: "Bối cảnh", duration: 14, narration: "Để hiểu rõ hơn, chúng ta cần nhìn vào bối cảnh và nguồn gốc của vấn đề.", visualPrompt: `Illustration of ${topic} history`, videoPrompt: "parallax", camera: "Trung cảnh", transition: "Slide" },
      { title: "Điểm chính 1", duration: 16, narration: "Điểm đầu tiên cực kỳ quan trọng mà ít người biết...", visualPrompt: `Detail shot ${topic}`, videoPrompt: "zoom in", camera: "Cận", transition: "Cut" },
      { title: "Điểm chính 2", duration: 16, narration: "Tiếp theo, đây là điều sẽ thay đổi góc nhìn của bạn...", visualPrompt: `Comparison visual ${topic}`, videoPrompt: "dolly", camera: "Toàn", transition: "Zoom" },
      { title: "Kết thúc", duration: 8, narration: "Cảm ơn bạn đã theo dõi! Hãy like và subscribe nhé.", visualPrompt: `Happy ending ${topic}`, videoPrompt: "static", camera: "Trung cảnh", transition: "Fade" },
    ] as Partial<Scene>[],
  };
}

export function enrichScenesWithThumbs(scenes: Partial<Scene>[]): Scene[] {
  return scenes.map((s, i) => ({
    id: `s${Date.now()}_${i}`,
    index: i + 1,
    title: s.title || `Cảnh ${i + 1}`,
    duration: s.duration || 10,
    narration: s.narration || "",
    visualPrompt: s.visualPrompt || "",
    videoPrompt: s.videoPrompt || "",
    camera: s.camera || "Trung cảnh",
    transition: s.transition || "Fade",
    status: "pending" as const,
    thumbnail: thumbs[i % thumbs.length],
    imageUrl: thumbs[i % thumbs.length],
    progress: 0,
  }));
}

export function simulateGeneration(scene: Scene, onProgress: (p: number) => void): Promise<void> {
  return new Promise(resolve => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 7;
      if (p >= 100) { p = 100; clearInterval(iv); onProgress(100); resolve(); }
      else onProgress(Math.round(p));
    }, 400);
  });
}
