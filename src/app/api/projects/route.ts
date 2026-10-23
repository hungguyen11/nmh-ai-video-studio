import { NextResponse } from "next/server";
// Mock API - demonstrates secure backend pattern. Real DB would be Prisma + Postgres.
// All API keys are read from process.env, never exposed to client.
export async function GET() {
  // In production, check auth: const session = await getServerSession(...)
  return NextResponse.json({ mode: process.env.NEXT_PUBLIC_AI_MODE || "demo", message: "Use Zustand local store on client. This route is ready for DB integration." });
}
export async function POST(req: Request) {
  const body = await req.json();
  // Validate input server-side
  if (!body.topic || typeof body.topic !== "string" || body.topic.length > 500) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  // Check quota
  // Create project in DB...
  return NextResponse.json({ ok: true, id: "srv_" + Date.now() });
}
