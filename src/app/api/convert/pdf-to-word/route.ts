import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.CLOUDCONVERT_API_KEY) {
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Buat Job di CloudConvert
    const job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": {
          operation: "import/upload",
        },
        "convert-my-file": {
          operation: "convert",
          input: "import-my-file",
          output_format: "docx",
          engine: "office", // Akurasi tertinggi PDF ke Word
        },
        "export-my-file": {
          operation: "export/url",
          input: "convert-my-file",
        },
      },
    });

    // 2. Unggah file
    const uploadTask = job.tasks.filter((task) => task.name === "import-my-file")[0];
    await cloudConvert.tasks.upload(uploadTask, buffer, file.name);

    // 3. Tunggu proses selesai
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.filter((task) => task.name === "export-my-file")[0];
    
    if (exportTask.status === "error") {
      throw new Error(exportTask.message || "Terjadi kesalahan di CloudConvert");
    }

    const fileUrl = exportTask.result?.files?.[0]?.url;
    if (!fileUrl) {
      throw new Error("URL file tidak ditemukan dari hasil konversi.");
    }

    // 4. Unduh dari CloudConvert dan jadikan buffer agar frontend tetap bisa pakai Blob
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
        throw new Error("Gagal mengambil file yang telah dikonversi");
    }
    const finalBuffer = await fileResponse.arrayBuffer();

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
