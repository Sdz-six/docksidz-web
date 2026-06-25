import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

export async function POST(req: NextRequest) {
  try {
    // Mengumpulkan semua CloudConvert API Keys dari env (Mendukung CLOUDCONVERT_API_KEY, CLOUDCONVERT_API_KEY_2, dst)
    const apiKeys = Object.keys(process.env)
      .filter(k => k.startsWith("CLOUDCONVERT_API_KEY"))
      .sort() // Memastikan urutan beraturan: 1, 2, 3
      .map(k => process.env[k])
      .filter(Boolean) as string[];

    if (apiKeys.length === 0) {
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

    let lastError: any;

    // Loop melalui setiap Kunci API (Mekanisme Nyawa Cadangan)
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const apiKey = apiKeys[i];
        console.log(`[CloudConvert] Mencoba Kunci API ke-${i + 1} dari ${apiKeys.length}...`);
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
        
        await cloudConvert.tasks.upload(uploadTask, buffer, file.name);

        // 3. Tunggu hingga Job selesai
        job = await cloudConvert.jobs.wait(job.id);

        // 4. Ambil hasil file
        const exportTask = job.tasks.find(t => t.name === "export-my-file");
        if (!exportTask || exportTask.status !== "finished") {
          throw new Error("Gagal menyelesaikan konversi di server CloudConvert");
        }

        const fileUrl = exportTask.result?.files?.[0]?.url;

        if (!fileUrl) {
          throw new Error("URL hasil unduhan tidak ditemukan di respons CloudConvert.");
        }

        // 5. Download hasil dari CloudConvert untuk dikirim ke user
        const downloadRes = await fetch(fileUrl);
        const finalBuffer = await downloadRes.arrayBuffer();

        console.log(`[CloudConvert] Sukses menggunakan Kunci API ke-${i + 1}!`);

        return new NextResponse(finalBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="converted.docx"`,
            "X-Public-Url": fileUrl,
            "Access-Control-Expose-Headers": "X-Public-Url",
          },
        });

      } catch (error: any) {
        lastError = error;
        console.error(`[CloudConvert] Gagal dengan Kunci API ke-${i + 1}:`, error.message);
        
        // Jika gagal karena error selain kuota, tetap lanjutkan ke kunci berikutnya saja sebagai proteksi
        // (Misalnya limit concurrent task atau payment required)
      }
    }

    // Jika semua kunci gagal
    console.error("Semua Kunci API CloudConvert telah gagal atau habis limitnya.");
    throw lastError || new Error("Semua Kunci API gagal memproses permintaan.");
    
  } catch (error: any) {
    console.error("Error during pdf to word conversion (CloudConvert):", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
