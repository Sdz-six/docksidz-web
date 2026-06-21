import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = `https://www.sankavollerei.web.id/berita/cnn?apikey=planaai`;
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
