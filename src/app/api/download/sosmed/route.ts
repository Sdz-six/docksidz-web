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

    if (!finalUrl.includes("tiktok.com")) {
      throw new Error("Mohon maaf, API gratis saat ini HANYA mendukung link TikTok. Silakan masukkan link TikTok.");
    }

    // Buka tautan pendek vt.tiktok.com ke URL aslinya agar TikWM tidak error
    if (finalUrl.includes("vt.tiktok.com") || finalUrl.includes("vm.tiktok.com")) {
      try {
        const redirectRes = await fetch(finalUrl, { method: "HEAD", redirect: "follow" });
        finalUrl = redirectRes.url;
        // Hapus query parameters dari URL asli untuk menghindari error parser TikWM
        finalUrl = finalUrl.split("?")[0];
      } catch (e) {
        console.error("Gagal resolve link pendek TikTok", e);
      }
    }

    // Panggil API TikWM
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || data.code !== 0 || !data.data) {
      throw new Error(data.msg || "Gagal mengekstrak video TikTok. Server sedang sibuk atau link salah.");
    }

    const resultData = data.data;

    const urls = [];
    if (resultData.play) {
      urls.push({
        url: resultData.play,
        ext: "mp4",
        quality: "HD (Tanpa Watermark)"
      });
    }
    
    if (resultData.music) {
      urls.push({
        url: resultData.music,
        ext: "mp3",
        quality: "Audio (MP3)"
      });
    }

    const mappedResult = {
      result: {
        title: resultData.title || "Video TikTok",
        thumbnail: resultData.cover || "",
        urls: urls
      }
    };

    return NextResponse.json(mappedResult);
  } catch (error: any) {
    console.error("Sosmed Downloader Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal." }, { status: 500 });
  }
}

