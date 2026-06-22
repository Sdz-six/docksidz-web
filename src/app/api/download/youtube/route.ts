import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL tidak boleh kosong." }, { status: 400 });
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http")) {
      finalUrl = "https://" + finalUrl;
    }

    if (!finalUrl.includes("youtube.com") && !finalUrl.includes("youtu.be")) {
      throw new Error("Mohon maaf, ini khusus untuk tautan YouTube.");
    }

    // Mengambil API Key dari .env.local atau menggunakan default string yang diberikan pengguna
    const apiKey = process.env.SANKAVOLLEREI_API_KEY || "ISI_APIKEYNYA";
    
    // Panggil API Sankavollerei
    const apiUrl = `https://www.sankavollerei.web.id/download/ytmp4?apikey=${apiKey}&url=${encodeURIComponent(finalUrl)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || data.status === false) {
      throw new Error(data.error || "Gagal mengunduh melalui API Sanka Vollerei.");
    }

    // Adaptif membaca struktur respons JSON dari Sanka
    const resultObj = data.data || data.result || data;
    const downloadUrl = resultObj.url || resultObj.link || resultObj.download || resultObj.url_video;
    const videoTitle = resultObj.title || "Video YouTube";
    const thumbnail = resultObj.thumbnail || resultObj.thumb || "";

    if (!downloadUrl) {
      throw new Error("Format respons API Sanka tidak dikenali atau URL unduhan kosong.");
    }

    return NextResponse.json({
      result: {
        title: videoTitle,
        thumbnail: thumbnail,
        urls: [
          { url: downloadUrl, ext: "mp4", quality: "Video (MP4)" }
        ]
      }
    });

  } catch (error: any) {
    console.error("YouTube Downloader Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal." }, { status: 500 });
  }
}
