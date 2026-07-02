/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          light: "#F8F7FF",
          dark: "#0E0B21",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#161331",
        },
        ink: {
          900: "#1E1B4B",
          700: "#3B3766",
          500: "#6B6790",
        },
        brand: {
          violet: "#7C3AED",
          violetDeep: "#5B21B6",
          blue: "#2563EB",
          cyan: "#22D3EE",
        },
        gold: "#D4AF37",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #5B21B6 100%)",
        "brand-radial": "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.25), transparent 40%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(30, 27, 75, 0.15)",
        glow: "0 0 40px rgba(124, 58, 237, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
