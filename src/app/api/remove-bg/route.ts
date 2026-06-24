import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image_file");

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    // Menggunakan API Key rahasia dari pemilik web
    const API_KEY = "FqcrLAzQ7g6d6rUN8bAszVJV";

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg Error:", errorText);
      return NextResponse.json(
        { error: "Gagal menghubungi server Remove.bg" },
        { status: response.status }
      );
    }

    // Mengambil buffer gambar hasil potongan
    const arrayBuffer = await response.arrayBuffer();
    
    // Mengembalikan gambar langsung ke klien
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="removed-bg.png"',
      },
    });

  } catch (error: any) {
    console.error("Internal API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
