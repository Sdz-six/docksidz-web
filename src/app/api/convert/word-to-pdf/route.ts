import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const apyToken = process.env.APYHUB_API_KEY || "APY0xw6CfXypKlrdtC3PFu3ccBUyWMxOdJReI02KZanKDZOax96DeZS8boCzp6fcNN4F";

    const response = await fetch("https://api.apyhub.com/convert/word-file/pdf-file", {
      method: "POST",
      headers: {
        "apy-token": apyToken,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ApyHub Error: ${response.status} - ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error during word to pdf conversion:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
