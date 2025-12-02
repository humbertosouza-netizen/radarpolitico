import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'bg-primary': '#050B16',
        'bg-panel': '#0A111F',
        'bg-shadow': '#0A1326',
        'border': '#1C2633',
        'glow-green': '#4CFF85',
        'glow-cyan': '#29F1FF',
        'text-primary': '#E8F0F2',
        'text-secondary': '#9CAABA',
      },
      borderRadius: {
        'card': '20px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(76, 255, 133, 0.3), 0 0 40px rgba(76, 255, 133, 0.1)',
        'glow-cyan': '0 0 20px rgba(41, 241, 255, 0.3), 0 0 40px rgba(41, 241, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config

