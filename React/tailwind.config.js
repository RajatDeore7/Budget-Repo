const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  theme: {
    colors: {
      ...colors,
      'green': {
        ...colors.green,
        'light': '#2e8212',
        'dark': '#006400',
      }
    },
  },
}