/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        focus: "var(--color-focus)",
        short: "var(--color-short)",
        long: "var(--color-long)",
      },
      width: {
        "modal-custom": "calc(100% - 0.75rem * 2)",
      },
      boxShadow: {
        'checkbox': 'inset 2px 2px 8px 4px rgba(0, 0, 0, 0.1)',
        'number': 'inset 2px 2px 4px 2px rgba(0,0,0,0.1)',
        'start': '0 4px 0 rgba(255, 255, 255, 0.65)',
        'custom-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      // TODO figure out later
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
        height: "height",
        colors: "background-color, border-color, color",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      transitionTimingFunction: {
        "custom-ease": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDelay: {
        200: "200ms",
      },
      // figure out later
    },
  },
  plugins: [],
};
