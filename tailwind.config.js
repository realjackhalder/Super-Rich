/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        condensed: ['"Arial Black"', 'Impact', '"Barlow Condensed"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widestCustom: '0.15em',
      }
    },
  },
  plugins: [],
}
