import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key CloudConvert belum diatur di server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const cloudConvert = new CloudConvert(apiKey);

    // 1. Buat Job CloudConvert
    let job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": {
          operation: "import/upload"
        },
        "convert-my-file": {
          operation: "convert",
          input: "import-my-file",
          output_format: "docx"
        },
        "export-my-file": {
          operation: "export/url",
          input: "convert-my-file"
        }
      }
    });

    // 2. Upload file ke CloudConvert
    const uploadTask = job.tasks.find(t => t.name === "import-my-file");
    if (!uploadTask) throw new Error("Gagal membuat task upload");
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await cloudConvert.tasks.upload(uploadTask, buffer, file.name);

    // 3. Tunggu hingga Job selesai
    job = await cloudConvert.jobs.wait(job.id);

    // 4. Ambil hasil file
    const exportTask = job.tasks.find(t => t.name === "export-my-file");
    if (!exportTask || exportTask.status !== "finished") {
      throw new Error("Gagal menyelesaikan konversi di server CloudConvert");
    }

    const fileUrl = exportTask.result.files[0].url;

    // 5. Download hasil dari CloudConvert untuk dikirim ke user
    const downloadRes = await fetch(fileUrl);
    const finalBuffer = await downloadRes.arrayBuffer();

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="converted.docx"`,
      },
    });
  } catch (error: any) {
    console.error("Error during pdf to word conversion (CloudConvert):", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
