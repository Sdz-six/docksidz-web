import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "traffic.json");

export async function GET() {
  try {
    let hits = 0;
    // Coba baca file database lokal
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      hits = JSON.parse(data).hits || 0;
    }
    
    // Tambah pengunjung baru
    hits += 1;
    
    // Simpan ke file
    fs.writeFileSync(dbPath, JSON.stringify({ hits }));
    
    return NextResponse.json({ hits });
  } catch (error) {
    console.error("Gagal membaca traffic:", error);
    // Jika gagal, kembalikan angka rahasia
    return NextResponse.json({ hits: 404 }); 
  }
}
