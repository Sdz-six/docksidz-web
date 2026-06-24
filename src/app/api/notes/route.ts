import { NextResponse } from "next/server";
import { createClient } from "redis";

export const dynamic = "force-dynamic"; // Matikan cache agresif Vercel

// URL diambil dari environment variable bawaan integrasi Vercel Redis
const redisUrl = process.env.KV_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || "";

// Fungsi pembantu untuk mendapatkan client Redis yang terhubung
async function getRedisClient() {
  try {
    // Tambahkan pengaman agar tidak macet (hang) jika Redis lokal tidak ada
    const clientOptions = {
      url: redisUrl || undefined,
      socket: {
        connectTimeout: 3000, // Maksimal tunggu 3 detik
        reconnectStrategy: false // Jangan mencoba reconnect berulang-ulang tanpa batas
      }
    };

    const client = createClient(clientOptions);
      
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
    return client;
  } catch (err) {
    console.error("Gagal connect ke Redis:", err);
    return null;
  }
}

export async function GET() {
  try {
    const client = await getRedisClient();
    if (!client) {
        return NextResponse.json({ notes: [], error: "Failed to connect to Redis" });
    }

    // Ambil data catatan dari database Redis (key: 'docksidz_guestbook_notes')
    const notesData = await client.get("docksidz_guestbook_notes");
    await client.disconnect(); // Selalu tutup koneksi di environment serverless

    return NextResponse.json({ notes: notesData || "[]" }); // Kembalikan string JSON atau "[]"
  } catch (error) {
    console.error("Redis GET Error:", error);
    return NextResponse.json({ notes: [], error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notes } = body;

    if (!Array.isArray(notes)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 });
    }

    const client = await getRedisClient();
    if (!client) {
      return NextResponse.json({ success: false, error: "Failed to connect to Redis" }, { status: 500 });
    }

    // Karena ini database publik, kita batasi maksimal catatan misal 200 agar tidak jebol
    const limitedNotes = notes.slice(-200);

    // Simpan ke Redis
    await client.set("docksidz_guestbook_notes", JSON.stringify(limitedNotes));
    await client.disconnect(); // Tutup koneksi

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Redis POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save notes" }, { status: 500 });
  }
}
