/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nds: {
          bg: '#FAF9F5',
          surface: '#FFFFFF',
          elevated: '#F2EFE9',
          border: 'rgba(18, 18, 18, 0.12)',
          borderSubtle: 'rgba(18, 18, 18, 0.06)',
          ink: '#141413',
          muted: '#63625D',
          caption: '#8C8A84',
          accent: '#1B3B2B',
          accentLight: 'rgba(27, 59, 43, 0.08)',
          danger: '#A82828',
          dangerBg: '#FDF2F2',
          success: '#1B6B38',
          successBg: '#F0F9F3',
          dark: '#0C0D0E',
          darkSurface: '#161719',
        },
        darkBg: '#080808',
        cardBg: '#121316',
        cardBorder: '#1e2128',
        inputBg: '#17191e',
        inputBorder: '#282b35',
        neonGreen: '#a3e635',
        neonGreenMuted: 'rgba(163, 230, 53, 0.15)',
        emeraldGreen: '#00c087',
        roseRed: '#ff3b69',
        textMain: '#f3f4f6',
        textMuted: '#8b949e',
        textDim: '#586069',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        condensed: ['"Barlow Condensed"', '"Arial Black"', 'Impact', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widestCustom: '0.15em',
      }
    },
  },
  plugins: [],
}

