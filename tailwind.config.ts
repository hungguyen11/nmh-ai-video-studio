import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#7C5BFF", light: "#EDE9FE", dark: "#6D28D9", hover: "#6B4EFF" },
        surface: "#F6F7FB",
        card: "#FFFFFF",
        muted: "#6B7280",
        border: "#E5E7EB",
        coral: "#FF8A65",
        mint: "#34D399",
        lavender: "#A78BFA",
        cream: "#FFF7ED",
        baby: "#93C5FD",
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      boxShadow: { card: "0 4px 24px rgba(16,24,40,0.06)", soft: "0 2px 12px rgba(16,24,40,0.05)" },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
