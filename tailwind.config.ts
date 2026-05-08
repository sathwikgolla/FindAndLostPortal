import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          dark: {
            navy: "#07111F",
            deep: "#0F2A5F"
          },
          accent: {
            purple: "#6D5DF7",
            cyan: "#06B6D4"
          },
          surface: {
            light: "#F8FAFC",
            white: "#FFFFFF"
          },
          text: {
            heading: "#0F172A",
            subheading: "#1E293B",
            paragraph: "#1E293B",
            secondary: "#334155",
            meta: "#475569",
            helper: "#64748B",
            onDarkHeading: "#FFFFFF",
            onDarkSubheading: "#F8FAFC",
            onDarkParagraph: "#E2E8F0",
            onDarkSmall: "#CBD5E1",
            onDarkLabel: "#CBD5E1",
            light: {
              heading: "#0F172A",
              subheading: "#1E293B",
              paragraph: "#1E293B",
              secondary: "#334155",
              meta: "#475569",
              helper: "#64748B"
            },
            dark: {
              heading: "#FFFFFF",
              subheading: "#F8FAFC",
              paragraph: "#E2E8F0",
              label: "#CBD5E1",
              small: "#CBD5E1"
            }
          },
          green: {
            // Compatibility aliases for existing classnames while transitioning
            dark: "#0F2A5F",
            olive: "#06B6D4",
            sage: "#6D5DF7",
            light: "#0F2A5F",
            bg: "#07111F"
          }
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(7, 17, 31, 0.12)",
        lift: "0 28px 70px rgba(7, 17, 31, 0.16)",
        glow: "0 0 0 1px rgba(6, 182, 212, 0.22), 0 28px 70px rgba(7, 17, 31, 0.16)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-60%)" },
          "100%": { transform: "translateX(60%)" }
        }
      },
      animation: {
        floaty: "floaty 5.5s ease-in-out infinite",
        shimmer: "shimmer 1.3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
