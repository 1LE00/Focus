/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        focus: "var(--color-focus)",
        short: "var(--color-short)",
        long: "var(--color-long)",
        purple: "var(--color-purple)",
        gold: "var(--color-gold)",
        red: "var(--color-red)",
        yellow: "var(--color-yellow)",
        blue: "var(--color-blue)",
        greens: "var(--color-green)",
        pink: "var(--color-pink)",
        graye: "var(--color-gray)",
        peach: "var(--color-peach)",
        ocean: "var(--color-ocean)",
        orange: "var(--color-orange)",
        teal: "var(--color-teal)",
        blackjet: "var(--color-black-jet)",
        charcoal: "var(--color-black-charcoal)",
        dark: "var(--color-dark)"
      },
      width: {
        "modal-custom": "calc(100% - 0.75rem * 2)",
      },
      height:{
        'modal-custom': "calc(100% - 45px * 2)"
      },
      boxShadow: {
        checkbox: "inset 2px 2px 8px 4px rgba(0, 0, 0, 0.1)",
        number: "inset 2px 2px 4px 2px rgba(0,0,0,0.1)",
        start: "0 4px 0 rgba(255, 255, 255, 0.65)"
      },
      // figure out later
    },
  },
  // * Adding these safelist because it didn't show up after bg-long as they were not used anywhere
  purge: {
    options: {
      safelist: [
        "bg-focus",
        "bg-short",
        "bg-long",
        "bg-purple",
        "bg-gold",
        "bg-red",
        "bg-yellow",
        "bg-blue",
        "bg-greens",
        "bg-pink",
        "bg-graye",
        "bg-peach",
        "bg-ocean",
        "bg-orange",
        "bg-teal",
        "bg-blackjet",
        "bg-charcoal",
        "bg-dark",
        "text-focus",
        "text-short",
        "text-long",
        "text-purple",
        "text-gold",
        "text-red",
        "text-yellow",
        "text-blue",
        "text-greens",
        "text-pink",
        "text-graye",
        "text-peach",
        "text-ocean",
        "text-orange",
        "text-teal",
        "text-blackjet",
        "text-charcoal",
        "text-dark"
      ],
    },
  },
  plugins: [],
};
