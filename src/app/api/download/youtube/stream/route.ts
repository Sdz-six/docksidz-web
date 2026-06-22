import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

function nodeStreamToWebStream(nodeStream: Readable) {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    }
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const ext = req.nextUrl.searchParams.get("ext") || "mp4";
  
  if (!url || !ytdl.validateURL(url)) {
    return new NextResponse("Invalid YouTube URL", { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const safeTitle = info.videoDetails.title.replace(/[^\w\s-]/g, "") || "Video";
    const filename = `DockSidz_YouTube_${safeTitle}.${ext}`;

    const filterType = ext === "mp3" ? "audioonly" : "videoandaudio";
    
    // Piping the stream from ytdl-core directly to the user
    const stream = ytdl(url, { filter: filterType as any });
    const webStream = nodeStreamToWebStream(stream);

    return new NextResponse(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": ext === "mp3" ? "audio/mpeg" : "video/mp4",
      },
    });
  } catch(error) {
    console.error("YouTube Stream Error:", error);
    return new NextResponse("Failed to download YouTube video", { status: 500 });
  }
}
