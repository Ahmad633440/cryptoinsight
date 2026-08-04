import { NextResponse } from 'next/server';
import { getLiveCoins } from '@/services/dashboardCoins';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fetch cached CoinGecko prices to pass to Flask backend (so it doesn't get blocked)
    let liveCoins: any[] = [];
    try {
      liveCoins = await getLiveCoins();
    } catch (e) {
      console.error('[API] Failed to get live coins from cache:', e);
    }

    const backendUrl = process.env.FLASK_BACKEND_URL || 'http://127.0.0.1:5000';
    console.log('[API] Connecting to chatbot backend at:', backendUrl);
    const response = await fetch(`${backendUrl}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        liveCoins,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error connecting to Flask backend:', error);
    return NextResponse.json(
      { error: `Failed to connect to backend: ${error.message}. Make sure the Flask app is running.` },
      { status: 500 }
    );
  }
}
