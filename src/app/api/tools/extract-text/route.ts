import { NextRequest, NextResponse } from "next/server";
import * as mammoth from "mammoth";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // Deteksi berdasarkan MIME type atau Ekstensi
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.name.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: "Format file tidak didukung. Harap unggah PDF atau DOCX." }, { status: 400 });
    }

    // Bersihkan teks dari spasi ganda atau karakter aneh yang berlebihan
    extractedText = extractedText.replace(/\s+/g, ' ').trim();

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error("Extract Text API Error:", error);
    return NextResponse.json({ error: error.message || "Gagal mengekstrak teks dari dokumen." }, { status: 500 });
  }
}
