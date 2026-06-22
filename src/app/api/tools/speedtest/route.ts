import { NextResponse } from "next/server";

export async function GET() {
  // Generate 2MB of random data
  const sizeInBytes = 2 * 1024 * 1024; 
  const buffer = Buffer.alloc(sizeInBytes, '0');
  
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(req: Request) {
  // Read and discard to measure upload speed
  try {
    await req.arrayBuffer(); 
  } catch(e) {}
  
  return new NextResponse(JSON.stringify({ status: "ok" }), { 
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  });
}
