import { NextResponse } from "next/server";
import { createClient } from "redis";

export const dynamic = "force-dynamic";

// Ambil URL dari environment variable Vercel
const redisUrl = process.env.KV_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || "";

async function getRedisClient() {
  try {
    const client = redisUrl.startsWith("redis") 
      ? createClient({ url: redisUrl }) 
      : createClient();
      
    client.on('error', (err) => console.error('Redis Traffic Client Error', err));
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
        return NextResponse.json({ hits: 999, error: "Failed to connect to Redis" });
    }

    // Ambil data hits, lalu tambah 1
    const currentHitsRaw = await client.get("docksidz_visitor_count");
    let currentHits = currentHitsRaw ? parseInt(currentHitsRaw) : 100; // Mulai dari 100 agar terlihat keren
    
    currentHits += 1;
    
    // Simpan kembali
    await client.set("docksidz_visitor_count", currentHits.toString());
    
    await client.disconnect();

    return NextResponse.json({ hits: currentHits });
  } catch (error) {
    console.error("Redis Traffic Error:", error);
    return NextResponse.json({ hits: 888 }); 
  }
}
