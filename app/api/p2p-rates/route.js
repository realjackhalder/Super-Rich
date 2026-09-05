import { NextResponse } from 'next/server';

export async function GET() {
  // Delegate to rates endpoint
  try {
    const fallbacks = {
      MMK: 4595,
      THB: 36.3,
      VND: 25000,
      SGD: 1.33,
      EUR: 0.92,
      CNY: 7.24,
      MYR: 4.45,
      USD: 1.00,
      GBP: 0.78,
      JPY: 154.2,
      KRW: 1370.0,
      INR: 84.2,
      TWD: 32.3
    };

    return NextResponse.json({
      success: true,
      data: fallbacks
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
