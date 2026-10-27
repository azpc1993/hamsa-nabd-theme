// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        // Keep logical properties (inset-inline-start, border-inline-start, padding-inline…)
        // so RTL/LTR flip automatically — lowering them to left/right breaks Arabic layouts.
        'logical-properties-and-values': false,
      },
    },
  }
}