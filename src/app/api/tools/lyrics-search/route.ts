import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ error: 'Parameter teks pencarian diperlukan' }, { status: 400 });
  }

  const apikey = process.env.SANKAVOLLEREI_API_KEY;

  if (!apikey) {
    return NextResponse.json({ error: 'API key belum dikonfigurasi di server' }, { status: 500 });
  }

  try {
    const url = `https://www.sankavollerei.web.id/search/lirik?apikey=${apikey}&text=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Caching sementara untuk menghindari hit API berulang untuk lagu yang sama
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Lirik API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghubungi server lirik. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
