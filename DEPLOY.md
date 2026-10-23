# Deploy NMH AI Video Studio

## 1. Push lên GitHub của bạn
Trong máy local (hoặc trên GitHub web tạo repo trống tên `nmh-ai-video-studio`):

```bash
cd /home/user/nmh-studio
git remote add origin https://github.com/YOUR_USERNAME/nmh-ai-video-studio.git
git push -u origin main
```

Nếu bạn cung cấp Personal Access Token, tôi có thể push giúp:
```bash
git remote add origin https://<TOKEN>@github.com/YOUR_USERNAME/nmh-ai-video-studio.git
git push -u origin main
```

## 2. Deploy 1-click

### Vercel (khuyên dùng)
1. Vào https://vercel.com/new
2. Import repo `nmh-ai-video-studio`
3. Framework: Next.js, để mặc định
4. Env: `NEXT_PUBLIC_AI_MODE=demo`
5. Deploy → có ngay link `https://nmh-ai-video-studio.vercel.app`

### Netlify / Render / Railway
- Build command: `npm run build`
- Output: `.next`
- Start: `npm start`

## 3. Live preview hiện tại (sandbox)
https://3000-xxx.e2b.app (xem trong Arena live preview panel)

## 4. Bật AI thật
- Điền `.env.local` theo `.env.example`
- Đặt `NEXT_PUBLIC_AI_MODE=live`
- Deploy lại
