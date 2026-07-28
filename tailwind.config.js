/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b18',
          900: '#080f1f',
          800: '#0d1631',
          700: '#121e42',
          600: '#1a2a5e',
        },
        accent: {
          DEFAULT: '#4f8ef7',
          blue: '#4f8ef7',
          violet: '#7c6af7',
          glow: '#6ea6ff',
          cyan: '#38bdf8',
        },
        charcoal: '#1a1f2e',
        muted: '#8892a4',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79,142,247,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(79,142,247,0.7)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at center, #0d1631 0%, #050b18 70%)',
      },
    },
  },
  plugins: [],
}
