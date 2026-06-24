import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Inisialisasi Redis client dengan credential dari Vercel Environment Variables
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

export async function GET() {
  try {
    // Jika tidak ada URL, berarti user belum setup Vercel KV. Beri response kosong agar web tidak crash.
    if (!redisUrl) {
      return NextResponse.json({ notes: [], error: "KV_REST_API_URL or UPSTASH_REDIS_REST_URL is missing. Please setup Upstash Redis." });
    }

    // Ambil data catatan dari database Redis (key: 'docksidz_guestbook_notes')
    const notes = await redis.get("docksidz_guestbook_notes");
    return NextResponse.json({ notes: notes || [] });
  } catch (error) {
    console.error("Redis GET Error:", error);
    return NextResponse.json({ notes: [], error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!redisUrl) {
      return NextResponse.json({ success: false, error: "Redis URL is missing" }, { status: 500 });
    }

    const body = await request.json();
    const { notes } = body;

    if (!Array.isArray(notes)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 });
    }

    // Karena ini database publik, kita batasi maksimal catatan misal 200 agar tidak jebol
    const limitedNotes = notes.slice(-200);

    // Simpan ke Redis
    await redis.set("docksidz_guestbook_notes", JSON.stringify(limitedNotes));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Redis POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save notes" }, { status: 500 });
  }
}
