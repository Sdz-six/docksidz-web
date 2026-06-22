import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json({ error: "Alamat IP tidak boleh kosong." }, { status: 400 });
    }

    const cleanIp = ip.trim();
    // Gunakan ip-api.com (Sangat cepat dan reliable)
    const apiUrl = `http://ip-api.com/json/${cleanIp}`;
    
    const response = await fetch(apiUrl);
    const text = await response.text();
    
    let data;
    try {
        data = JSON.parse(text);
    } catch(e) {
        throw new Error("Provider API menolak permintaan. Silakan coba lagi.");
    }

    if (data.status === "fail") {
      throw new Error(data.message || "Alamat IP tidak valid atau tidak ditemukan.");
    }

    return NextResponse.json({
      ip: data.query || cleanIp,
      network: data.as || "-",
      city: data.city || "-",
      region: data.regionName || "-",
      country: data.country || "-",
      org: data.org || "-",
      isp: data.isp || "-",
      lat: data.lat || 0,
      lon: data.lon || 0,
      timezone: data.timezone || "-"
    });

  } catch (error: any) {
    console.error("IP Tracker Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal." }, { status: 500 });
  }
}
