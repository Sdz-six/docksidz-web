import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json({ error: "Alamat IP tidak boleh kosong." }, { status: 400 });
    }

    const cleanIp = ip.trim();
    // Gunakan ipapi.co (Free tanpa key, 1000 req/hari)
    const apiUrl = `https://ipapi.co/${cleanIp}/json/`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "DockSidz-IP-Tracker"
      }
    });
    
    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || "Alamat IP tidak valid atau tidak ditemukan.");
    }

    return NextResponse.json({
      ip: data.ip,
      network: data.network || "-",
      city: data.city || "-",
      region: data.region || "-",
      country: data.country_name || "-",
      org: data.org || "-",
      isp: data.org || "-", // As fallback
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone || "-"
    });

  } catch (error: any) {
    console.error("IP Tracker Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal." }, { status: 500 });
  }
}
