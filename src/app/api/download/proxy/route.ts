import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://www.youtube.com/"
      }
    });
    
    if (!response.ok) {
      console.error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch file from remote server");
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    
    let ext = "bin";
    if (contentType.includes("video/mp4")) ext = "mp4";
    else if (contentType.includes("audio/mpeg") || contentType.includes("audio/mp3")) ext = "mp3";
    else if (contentType.includes("image/jpeg")) ext = "jpg";
    else if (contentType.includes("image/png")) ext = "png";
    else if (contentType.includes("image/webp")) ext = "webp";
    
    let prefix = "DockSidz_Media_";
    if (url.includes("tiktokcdn") || url.includes("tikwm")) prefix = "DockSidz_TikTok_";
    else if (url.includes("youtube") || url.includes("siputzx")) prefix = "DockSidz_YouTube_";
    else if (url.includes("pollinations")) prefix = "DockSidz_AI_Image_";
    else if (url.includes("qrserver")) prefix = "DockSidz_QRCode_";

    const filename = `${prefix}${Date.now()}.${ext}`;
    // Gunakan response.body (ReadableStream) agar hemat memori (streaming)
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Proxy Download Error:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
