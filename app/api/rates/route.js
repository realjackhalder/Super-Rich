import { NextResponse } from 'next/server';

// Default baseline data matching real market rates and the user's design
const defaultRates = [
  {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    flagSvg: 'https://flagcdn.com/w80/us.png',
    buy: 4570.00,
    sell: 4620.00,
    mid: 4595.00,
    change24h: 0.35,
    sparkline: [4560, 4565, 4558, 4572, 4580, 4575, 4588, 4590, 4585, 4592, 4595]
  },
  {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲',
    flagSvg: 'https://flagcdn.com/w80/mm.png',
    buy: 1.00,
    sell: 1.00,
    mid: 1.00,
    change24h: 0.00,
    sparkline: [1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    country: 'Thailand',
    currency: 'THB',
    flag: '🇹🇭',
    flagSvg: 'https://flagcdn.com/w80/th.png',
    buy: 125.80,
    sell: 127.40,
    mid: 126.60,
    change24h: 0.18,
    sparkline: [126.0, 126.1, 125.9, 126.3, 126.2, 126.5, 126.4, 126.7, 126.5, 126.6]
  },
  {
    country: 'Singapore',
    currency: 'SGD',
    flag: '🇸🇬',
    flagSvg: 'https://flagcdn.com/w80/sg.png',
    buy: 3420.00,
    sell: 3470.00,
    mid: 3445.00,
    change24h: -0.12,
    sparkline: [3460, 3455, 3458, 3450, 3448, 3452, 3440, 3442, 3446, 3445]
  },
  {
    country: 'Eurozone',
    currency: 'EUR',
    flag: '🇪🇺',
    flagSvg: 'https://flagcdn.com/w80/eu.png',
    buy: 4930.00,
    sell: 5000.00,
    mid: 4965.00,
    change24h: 0.22,
    sparkline: [4940, 4945, 4950, 4948, 4955, 4960, 4958, 4962, 4960, 4965]
  },
  {
    country: 'China',
    currency: 'CNY',
    flag: '🇨🇳',
    flagSvg: 'https://flagcdn.com/w80/cn.png',
    buy: 630.00,
    sell: 640.00,
    mid: 635.00,
    change24h: -0.08,
    sparkline: [638, 637, 636, 637, 635, 636, 634, 635, 634, 635]
  },
  {
    country: 'Japan',
    currency: 'JPY',
    flag: '🇯🇵',
    flagSvg: 'https://flagcdn.com/w80/jp.png',
    buy: 29.60,
    sell: 30.10,
    mid: 29.85,
    change24h: 0.05,
    sparkline: [29.75, 29.78, 29.72, 29.80, 29.79, 29.82, 29.81, 29.86, 29.83, 29.85]
  },
  {
    country: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    flagSvg: 'https://flagcdn.com/w80/gb.png',
    buy: 5820.00,
    sell: 5890.00,
    mid: 5855.00,
    change24h: 0.15,
    sparkline: [5830, 5840, 5835, 5845, 5850, 5842, 5858, 5852, 5855]
  },
  {
    country: 'Australia',
    currency: 'AUD',
    flag: '🇦🇺',
    flagSvg: 'https://flagcdn.com/w80/au.png',
    buy: 2980.00,
    sell: 3025.00,
    mid: 3002.50,
    change24h: 0.28,
    sparkline: [2985, 2990, 2995, 2992, 3000, 2998, 3005, 3001, 3002.5]
  },
  {
    country: 'South Korea',
    currency: 'KRW',
    flag: '🇰🇷',
    flagSvg: 'https://flagcdn.com/w80/kr.png',
    buy: 3.32,
    sell: 3.41,
    mid: 3.36,
    change24h: -0.04,
    sparkline: [3.38, 3.37, 3.38, 3.36, 3.37, 3.35, 3.37, 3.36]
  },
  {
    country: 'Malaysia',
    currency: 'MYR',
    flag: '🇲🇾',
    flagSvg: 'https://flagcdn.com/w80/my.png',
    buy: 1020.00,
    sell: 1045.00,
    mid: 1032.50,
    change24h: 0.11,
    sparkline: [1025, 1028, 1026, 1030, 1032, 1029, 1034, 1032.5]
  },
  {
    country: 'India',
    currency: 'INR',
    flag: '🇮🇳',
    flagSvg: 'https://flagcdn.com/w80/in.png',
    buy: 53.40,
    sell: 54.60,
    mid: 54.00,
    change24h: -0.02,
    sparkline: [54.1, 54.2, 54.0, 54.1, 53.9, 54.0, 54.1, 54.0]
  },
  {
    country: 'Taiwan',
    currency: 'TWD',
    flag: '🇹🇼',
    flagSvg: 'https://flagcdn.com/w80/tw.png',
    buy: 141.00,
    sell: 143.50,
    mid: 142.25,
    change24h: 0.09,
    sparkline: [141.5, 141.8, 142.0, 141.9, 142.3, 142.1, 142.25]
  },
  {
    country: 'Canada',
    currency: 'CAD',
    flag: '🇨🇦',
    flagSvg: 'https://flagcdn.com/w80/ca.png',
    buy: 3310.00,
    sell: 3360.00,
    mid: 3335.00,
    change24h: 0.14,
    sparkline: [3320, 3325, 3330, 3328, 3335, 3332, 3338, 3335]
  },
  {
    country: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪',
    flagSvg: 'https://flagcdn.com/w80/ae.png',
    buy: 1240.00,
    sell: 1260.00,
    mid: 1250.00,
    change24h: 0.05,
    sparkline: [1245, 1248, 1249, 1250, 1249, 1251, 1250]
  }
];

export async function GET() {
  let source = 'local-rates';
  let rates = [...defaultRates];

  // Try fetching from local host server on 3001 if active
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('http://127.0.0.1:3001/api/p2p-rates', {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        source = 'localhost:3001';
        const p2pData = json.data;
        const mmkUsdt = p2pData.MMK || 4595;

        rates = defaultRates.map(r => {
          if (r.currency === 'USD') {
            const mid = mmkUsdt;
            return {
              ...r,
              buy: Math.round(mid * 0.9945 * 100) / 100,
              sell: Math.round(mid * 1.0055 * 100) / 100,
              mid: Math.round(mid * 100) / 100
            };
          }

          if (p2pData[r.currency]) {
            const foreignPerUsdt = p2pData[r.currency];
            const mid = mmkUsdt / foreignPerUsdt;
            return {
              ...r,
              buy: Math.round(mid * 0.9945 * 100) / 100,
              sell: Math.round(mid * 1.0055 * 100) / 100,
              mid: Math.round(mid * 100) / 100
            };
          }
          return r;
        });
      }
    }
  } catch (err) {
    // If localhost:3001 is not running, fallback to standard rates
    source = 'nextjs-api';
  }

  return NextResponse.json({
    success: true,
    source,
    updatedAt: new Date().toISOString(),
    rates
  });
}
