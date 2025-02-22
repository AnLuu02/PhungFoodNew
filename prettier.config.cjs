/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  endOfLine: 'lf',
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-css-order', 'prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
  tailwindAttributes: ['className', 'classNames']
};

module.exports = config;
