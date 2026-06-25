import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json(
        { error: "API Key iLovePDF belum diatur di server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // 1. Dapatkan Token Auth
    const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });
    const authData = await authRes.json();
    if (!authRes.ok) throw new Error("Gagal autentikasi iLovePDF API");
    const token = authData.token;

    // 2. Start Task 'pdfword'
    const startRes = await fetch("https://api.ilovepdf.com/v1/start/pdfword", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const startData = await startRes.json();
    if (!startRes.ok) throw new Error("Gagal memulai task iLovePDF");
    const server = startData.server;
    const task = startData.task;

    // 3. Upload File
    const uploadFormData = new FormData();
    uploadFormData.append("task", task);
    uploadFormData.append("file", file);
    const uploadRes = await fetch(`https://${server}/v1/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: uploadFormData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error("Gagal mengunggah file ke iLovePDF");
    const serverFilename = uploadData.server_filename;

    // 4. Process
    const processRes = await fetch(`https://${server}/v1/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        task: task,
        tool: "pdfword",
        files: [
          {
            server_filename: serverFilename,
            filename: file.name,
          },
        ],
      }),
    });
    if (!processRes.ok) {
      const errText = await processRes.text();
      throw new Error(`Gagal memproses file: ${errText}`);
    }

    // 5. Download
    const downloadRes = await fetch(`https://${server}/v1/download/${task}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!downloadRes.ok) throw new Error("Gagal mengunduh hasil dari iLovePDF");
    
    const finalBuffer = await downloadRes.arrayBuffer();

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="converted.docx"`,
      },
    });
  } catch (error: any) {
    console.error("Error during pdf to word conversion:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
