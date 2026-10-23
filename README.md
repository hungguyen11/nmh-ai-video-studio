# NMH AI Video Studio — Biến ý tưởng thành video bằng AI

Website ứng dụng AI giúp biến ý tưởng thành video hoàn chỉnh: nhập chủ đề → thiết lập → kịch bản AI → storyboard → giữ nhân vật nhất quán → tạo hình/video/audio → studio biên tập → xuất MP4.

## ✨ Tính năng (MVP hoàn chỉnh)
- **Trang chủ** giới thiệu + tạo nhanh bằng chủ đề
- **Đăng ký/Đăng nhập** (mock auth, sẵn sàng NextAuth)
- **Dashboard** thống kê, dự án gần đây, trạng thái AI
- **Tạo dự án mới** (2 chế độ: Tự động / Có kiểm soát)
- **Thiết lập video**: 6 phong cách nội dung, 7 phong cách hình ảnh, tỉ lệ 16:9/9:16/1:1, độ phân giải, giọng đọc, nhạc, phụ đề
- **Kịch bản AI**: mock script thông minh theo chủ đề, có thể sửa & lưu
- **Storyboard**: thêm/xóa/sửa/kéo thả cảnh, prompt ảnh/video, camera, transition; tạo lại từng cảnh; theo dõi tiến trình thật (không giả lập ở live mode)
- **Studio biên tập**: preview video, timeline multi-track (video/voice/nhạc/phụ đề), inspector chỉnh prompt/thuộc tính cảnh, lưu & xuất MP4
- **Thư viện nhân vật & tài nguyên** (character reference)
- **Thư viện video đã xuất**
- **Gói dịch vụ & hạn mức**
- **Cài đặt & Trung tâm thông báo**

## 🎨 UI/UX
- Next.js 14 + Tailwind + TypeScript
- Màu: nền #F6F7FB, tím pastel #7C5BFF nhấn, coral/mint/lavender/baby blue có kiểm soát
- Card bo 16-20px, shadow nhẹ, responsive desktop → mobile

## 🏗️ Kiến trúc
- Frontend: Next.js App Router, Zustand + persist (localStorage) — tự động lưu, tải lại giữ nguyên dự án
- Backend: API routes `/api/projects` (sẵn sàng Prisma/Postgres), adapter pattern cho AI providers
- AI Adapters: `src/lib/aiAdapter.ts` — dễ đổi Replicate/Stability/ElevenLabs/OpenAI; Demo mode mặc định
- Bảo mật: API key chỉ ở server env, validate input, không auto-retry vô hạn, hiển thị ước tính chi phí

## 🚀 Chạy local
```bash
npm install
cp .env.example .env.local # điền key nếu muốn live
npm run dev # http://localhost:3000
npm run build && npm start
```

## 🔑 Cấu hình AI LIVE
1. Điền key vào `.env.local`
2. Đặt `NEXT_PUBLIC_AI_MODE=live`
3. Implement provider thật trong `src/lib/aiAdapter.ts` (đã có interface ImageProvider/VideoProvider/TTSProvider)
4. Kết nối DB (Prisma) và object storage (S3) cho production

## ✅ Tiêu chí nghiệm thu
- [x] Cài đặt & build không lỗi TS
- [x] Tạo/lưu/mở lại/chỉnh sửa dự án hoạt động
- [x] Storyboard thêm/sửa/xóa/sắp xếp
- [x] Studio preview + timeline + inspector
- [x] Xuất MP4 có xác minh (demo: giả lập 2.2s, live: FFmpeg)
- [x] API key không lộ, demo/live tách biệt
- [x] Responsive + empty/error/loading states

## 📦 Deploy
- Vercel: `vercel --prod` (đã tối ưu Next.js)
- Hoặc Docker: `docker build -t nmh-studio . && docker run -p 3000:3000 nmh-studio`

## 🧪 Kiểm thử
```bash
npm run build # phải pass
# Thử luồng: Trang chủ nhập "Windows bị chậm" → Thiết lập → Tạo kịch bản → Storyboard → Studio → Xuất
```

## 📌 Giới hạn & tiếp theo (Giai đoạn B/C)
- FFmpeg thật cần backend Node (đã chuẩn bị route, chạy local với ffmpeg binary)
- TTS thật cần ElevenLabs key + audio storage
- Thanh toán Stripe/VNPay
- Nhiều provider, xử lý hàng loạt, quản lý nhóm
