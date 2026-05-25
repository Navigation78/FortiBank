/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        '73px': '73px',
      },
      colors: {
        // Semantic theme colors backed by CSS variables.
        // Light values set in :root, dark values set in .dark (globals.css).
        'th-bg':    'var(--th-bg)',     // page background
        'th-srf':   'var(--th-srf)',    // surface: cards, panels
        'th-elv':   'var(--th-elv)',    // elevated: modals, dropdowns
        'th-bar':   'var(--th-bar)',    // topbar / sidebar background
        'th-brd':   'var(--th-brd)',    // default border
        'th-brds':  'var(--th-brds)',   // subtle border
        'th-txt':   'var(--th-txt)',    // primary text
        'th-txt2':  'var(--th-txt2)',   // secondary text
        'th-muted': 'var(--th-muted)',  // muted / placeholder text
        'th-hov':   'var(--th-hov)',    // hover background
        'th-act':   'var(--th-act)',    // active / pressed background
        'th-ibg':   'var(--th-ibg)',    // input background
        'th-ibrd':  'var(--th-ibrd)',   // input border
        'th-track': 'var(--th-track)',  // progress bar track
      },
    },
  },
  plugins: [],
}
