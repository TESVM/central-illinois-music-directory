import type { Config } from "tailwindcss";

/**
 * Token values follow DESIGN.md (Apple-design-analysis).
 *
 * The semantic names (`brand`, `ink`, `canvas`, `surface`, `line`) are the ones
 * the existing pages already reference, so remapping them here moves the whole
 * site onto the Apple palette without editing every component.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        canvas: "#f5f5f7", // Parchment — the signature Apple off-white
        surface: "#ffffff",
        pearl: "#fafafc",
        tile: {
          DEFAULT: "#272729",
          soft: "#2a2a2c",
          deep: "#252527"
        },

        // Text
        ink: "#1d1d1f",
        "ink-muted": "#333333",
        "ink-subtle": "#7a7a7a",

        // Hairlines
        line: "#e0e0e0",
        "line-soft": "#f0f0f0",

        /**
         * Action Blue ramp. DESIGN.md allows exactly one accent, so every
         * interactive element on the site resolves to this scale.
         */
        brand: {
          50: "#f0f6fd",
          100: "#dbeafb",
          300: "#7ab8f5",
          500: "#0071e3", // focus blue
          700: "#0066cc", // action blue
          900: "#004a99"
        },
        "brand-on-dark": "#2997ff",

        // Retained so older markup keeps compiling; not used in new work.
        sage: "#6ba292",
        sky: "#d9eef6",
        rose: "#f28b66"
      },
      fontFamily: {
        /**
         * On macOS/iOS this resolves to the real SF Pro. Everywhere else it
         * falls through to Inter, the closest open-source equivalent.
         */
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-inter)",
          "system-ui",
          "sans-serif"
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-inter)",
          "system-ui",
          "sans-serif"
        ]
      },
      fontSize: {
        // Apple runs body copy at 17px, not 16px.
        body: ["17px", { lineHeight: "1.47", letterSpacing: "-0.374px" }],
        tagline: ["21px", { lineHeight: "1.19", letterSpacing: "0.231px" }],
        lead: ["28px", { lineHeight: "1.14", letterSpacing: "0.196px" }],
        "display-md": ["34px", { lineHeight: "1.2", letterSpacing: "-0.374px" }],
        "display-lg": ["40px", { lineHeight: "1.1", letterSpacing: "-0.4px" }],
        hero: ["56px", { lineHeight: "1.07", letterSpacing: "-0.28px" }]
      },
      borderRadius: {
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px"
      },
      boxShadow: {
        /**
         * The only true shadow in the system, and it belongs to imagery —
         * never to cards, buttons, or text.
         */
        product: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0",
        // Kept as no-ops so existing `shadow-card` / `shadow-soft` usages
        // flatten instead of breaking the build.
        card: "none",
        soft: "none"
      },
      backgroundImage: {
        halo: "linear-gradient(180deg, #ffffff, #f5f5f7)"
      }
    }
  },
  plugins: []
};

export default config;
