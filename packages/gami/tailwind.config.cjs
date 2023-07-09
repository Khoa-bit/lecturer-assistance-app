const {fontFamily} = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["light"],
    // styled: false
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            // Remove margin from li
            ".ProseMirror li :not(li)": {margin: 0},
            // Style the task list and task item to align with ul and ol's li ::marker
            '.ProseMirror ul[data-type="taskList"]': {
              "li:last-child": {
                "margin-bottom": 0,
              },
              "> li": {
                display: "flex",
                padding: 0,
                // margin: 0,
                "> label": {
                  flex: "0 0 auto",
                  "user-select": "none",
                  "padding-inline": "0.3125em",
                },
                "> div": {
                  flex: "1 1 auto",
                  "padding-left": "0.3755em",
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
