import plugin from 'tailwindcss/plugin';

module.exports = plugin(function ({ addUtilities, theme }) {
  const newUtilities = {
    '.btn': {

    },
    '.flex-one': {
      color: "red",
      backgroundColor: "green",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.flex-one:hover': {
      color: "blue",
      backgroundColor: "var(--color-primary-800)",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  };
  addUtilities(newUtilities);
});