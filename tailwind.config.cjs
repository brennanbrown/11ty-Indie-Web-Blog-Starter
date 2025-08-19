/**** Tailwind CSS Configuration ****/
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{njk,md,html}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#F8F8F8',
          dark: '#0f1115'
        }
      },
      maxWidth: {
        'prose': '64ch'
      }
    }
  },
  plugins: []
};
