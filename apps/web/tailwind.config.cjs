/**
 * Tailwind theme — the same hexes as src/design/tokens.css, exposed as utilities.
 *
 * The duplication is deliberate and documented in tokens.css: utilities cover the common case
 * (`bg-ground`, `text-ink-soft`, `border-line`), and `var(--token)` covers what Tailwind cannot
 * reach. If you change a value, change it in BOTH — there is a test that fails if they drift
 * (src/design/__tests__/tokens.test.ts).
 */

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: "#f5efe0",
          warm: "#f9f4e8",
        },
        surface: {
          DEFAULT: "#fffdf7",
          sunken: "#f2eada",
        },
        frame: {
          DEFAULT: "#2e4034",
          deep: "#233026",
          tint: "#3c5243",
        },
        "on-frame": {
          DEFAULT: "#f5efe0",
          soft: "#b9c7bb",
        },
        accent: {
          DEFAULT: "#b03a2e",
          hover: "#963126",
          wash: "#f6e7e2",
        },
        badge: {
          DEFAULT: "#d9b978",
          ink: "#7a5a22",
        },
        ink: {
          DEFAULT: "#2b2b28",
          soft: "#6b6257",
          faint: "#9a9183",
        },
        line: {
          DEFAULT: "#e3dac6",
          strong: "#cfc2a6",
        },
        danger: {
          DEFAULT: "#8c3b1e",
          wash: "#f7e9e1",
        },
        ok: {
          DEFAULT: "#4a6b4e",
          wash: "#e8efe6",
        },
        warn: {
          DEFAULT: "#a9791f",
          wash: "#f8f0dd",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", '"Iowan Old Style"', '"Times New Roman"', "serif"],
        body: ['"Source Sans 3"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
        script: ['"Caveat"', '"Segoe Script"', '"Bradley Hand"', "cursive"],
        mono: ["ui-monospace", "SFMono-Regular", '"Cascadia Mono"', "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,43,40,.04), 0 1px 12px rgba(43,43,40,.03)",
        raised: "0 2px 6px rgba(43,43,40,.07), 0 8px 24px rgba(43,43,40,.05)",
        focus: "0 0 0 3px rgba(176,58,46,.28)",
      },
      maxWidth: {
        shell: "1240px",
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
