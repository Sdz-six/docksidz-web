import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return NextResponse.json({ error: 'Parameter URL video YouTube diperlukan' }, { status: 400 });
  }

  const apikey = process.env.SANKAVOLLEREI_API_KEY;

  if (!apikey) {
    return NextResponse.json({ error: 'API key belum dikonfigurasi di server' }, { status: 500 });
  }

  try {
    const targetUrl = `https://www.sankavollerei.web.id/tools/youtubetranscript?apikey=${apikey}&url=${encodeURIComponent(videoUrl)}`;
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache transkrip selama 24 jam karena percakapan video lama biasanya statis
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validasi respons Sanka
    if (!data.status || !data.result) {
      throw new Error(data.error || 'Server tidak dapat memproses transkrip untuk video ini.');
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('YouTube Transcript API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengekstrak transkrip. Pastikan tautan valid dan video memiliki subtitle/CC.' },
      { status: 500 }
    );
  }
}
