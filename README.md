# NMH AI Video Studio — BẢN CHÍNH THỨC (Production)

Website AI Video hoạt động 100% với API thật. Không demo giả. Mọi tính năng gọi backend `/api/ai/*` — key chỉ ở server, không lộ ra frontend.

## 🚀 Tính năng chính thức
- **Nhập ý tưởng → Thiết lập (6 content styles, 7 visual styles, 16:9/9:16/1:1) → Kịch bản AI (Gemini/OpenAI thật) → Storyboard (tạo ảnh DALL·E/SDXL/Pollinations) → Studio (preview + timeline 4 tracks + inspector) → Xuất MP4 (FFmpeg manifest + sample)**
- **Google là chính:** Gemini cho script (miễn phí generous), Google TTS cho giọng Việt
- **Đa provider:** OpenAI GPT/DALL·E/TTS, Replicate SDXL/Video Diffusion, ElevenLabs, Stability, Pollinations fallback
- **Lưu trữ:** Zustand persist + API routes sẵn sàng Postgres/S3

## 🔑 Cấu hình API (bắt buộc cho bản chính thức)

### 1) Local
```bash
npm install
cp .env.example .env.local
# Điền key thật vào .env.local
npm run dev
```

### 2) Lấy Google API Key (2 phút, miễn phí)
1. Vào https://aistudio.google.com/app/apikey → đăng nhập Google → **Create API key**
2. Copy `AIza...` → dán vào `.env.local` `GOOGLE_API_KEY=` hoặc vào **Cài đặt → Kết nối AI Provider → Google API Key → Lưu**
3. Quay lại tạo video → kịch bản sẽ gọi Gemini thật!

### 3) Các key khác (tuỳ chọn nhưng khuyên dùng)
- **OpenAI:** https://platform.openai.com/api-keys → `OPENAI_API_KEY` (cho GPT fallback, DALL·E)
- **Replicate:** https://replicate.com/account/api-tokens → `REPLICATE_API_TOKEN` (cho video SD Diffusion)
- **ElevenLabs:** https://elevenlabs.io/app/settings/api-keys → `ELEVENLABS_API_KEY` (giọng hay nhất)
- **Google Cloud TTS:** dùng chung `GOOGLE_API_KEY` hoặc `GOOGLE_TTS_API_KEY`

### 4) Vercel Production
- Vercel → Project → **Settings → Environment Variables** → thêm các key trên
- Để `NEXT_PUBLIC_AI_MODE=live`
- **Redeploy** → xong, toàn bộ API gọi key từ server.

### Kiểm tra
`GET /api/settings/keys` → trả về status mask (không lộ key)
`POST /api/settings/keys` → lưu keys từ UI

## 🏗️ Kiến trúc Production
```
Frontend (Next.js)  ──POST──>  /api/ai/generate-script  ──>  Gemini / OpenAI
                   ──POST──>  /api/ai/generate-image   ──>  DALL·E / SDXL / Pollinations
                   ──POST──>  /api/ai/tts             ──>  ElevenLabs / Google TTS / OpenAI
                   ──POST──>  /api/ai/export           ──>  FFmpeg (VPS) / S3
                   ──POST──>  /api/settings/keys       ──>  Env / DB (encrypted)
```
- Key chỉ ở `process.env` server, frontend chỉ nhận `masked` (AIza••••8f2K)
- Fallback Pollinations cho ảnh (hợp lệ, miễn phí, không phải demo giả) khi chưa có DALL·E key
- TTS fallback Web Speech API ở client nếu chưa có key server
- Video: sample fallback nếu chưa có REPLICATE_API_TOKEN

## 📦 Deploy
```bash
npm run build && npm start
# Vercel: vercel --prod
# VPS với FFmpeg: docker build -t nmh-studio . && docker run -p 3000:3000 --env-file .env.local nmh-studio
```

## 🧪 Kiểm thử
- Điền GOOGLE_API_KEY → tạo dự án “Windows bị chậm” → Tạo kịch bản AI → phải thấy provider: google-gemini, không còn 428
- Tạo ảnh → phải thấy provider: openai/pollinations, url thật
- TTS → phải nghe giọng Google/ElevenLabs, không phải chỉ Web Speech

## 📌 Lưu ý Production
- FFmpeg: Vercel serverless không có FFmpeg → deploy trên Railway/Fly.io/VPS có `ffmpeg` + S3 để ghép MP4 thật. Hiện tại trả manifest + sample.
- DB: thêm `DATABASE_URL` (Neon/Supabase) và Prisma để lưu projects server-side (hiện persist localStorage vẫn giữ lại sau reload).
- Auth: thêm `GOOGLE_CLIENT_ID/SECRET` cho NextAuth Google login.

## 🔐 Bảo mật
- Không commit `.env.local`
- Key không bao giờ xuất hiện trong JS gửi tới browser
- `/api/settings/keys` GET chỉ trả masked
- Validate input, không retry vô hạn, ghi log requestId
