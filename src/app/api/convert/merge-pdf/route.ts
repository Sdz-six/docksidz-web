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
    const files = formData.getAll("file") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "Dibutuhkan setidaknya 2 file untuk digabungkan" }, { status: 400 });
    }

    const tasks: Record<string, any> = {};
    const inputNames: string[] = [];

    // 1. Buat tugas upload untuk masing-masing file
    files.forEach((file, index) => {
      const taskName = `import-${index}`;
      tasks[taskName] = { operation: "import/upload" };
      inputNames.push(taskName);
    });

    // 2. Buat tugas merge
    tasks["merge-files"] = {
      operation: "merge",
      input: inputNames,
      output_format: "pdf"
    };

    // 3. Buat tugas export
    tasks["export-my-file"] = {
      operation: "export/url",
      input: ["merge-files"],
    };

    const job = await cloudConvert.jobs.create({ tasks });

    // 4. Unggah semua file secara paralel
    const uploadPromises = files.map(async (file, index) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadTask = job.tasks.filter((task) => task.name === `import-${index}`)[0];
      return cloudConvert.tasks.upload(uploadTask, buffer, file.name);
    });

    await Promise.all(uploadPromises);

    // 5. Tunggu proses selesai
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.filter((task) => task.name === "export-my-file")[0];
    
    if (exportTask.status === "error") {
      throw new Error(exportTask.message || "Terjadi kesalahan di CloudConvert");
    }

    const fileUrl = exportTask.result?.files?.[0]?.url;
    if (!fileUrl) {
      throw new Error("URL file tidak ditemukan dari hasil konversi.");
    }

    // 6. Unduh dari CloudConvert dan kembalikan sebagai buffer biner
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
        throw new Error("Gagal mengambil file yang telah digabungkan");
    }
    const finalBuffer = await fileResponse.arrayBuffer();

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Merged_Document.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error during merge pdf conversion:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
