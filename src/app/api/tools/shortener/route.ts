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

    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(finalUrl)}`;
    const response = await fetch(apiUrl);
    const textData = await response.text();

    if (!response.ok || textData.toLowerCase().includes("error")) {
      throw new Error(textData || "Gagal memendekkan tautan.");
    }

    return NextResponse.json({ shorturl: textData });
  } catch (error: any) {
    console.error("URL Shortener Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal." }, { status: 500 });
  }
}
