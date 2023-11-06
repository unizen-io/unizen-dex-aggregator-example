/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: { extend: {} },
  plugins: [
    require('@tailwindcss/forms'),
    // MEMO: inspired by https://github.com/croutonn/tailwindcss-pseudo-elements
    require('tailwindcss-pseudo-elements'),
    plugin(function ({
      addUtilities,
      addBase,
      theme,
      addVariant
    }) {
      addUtilities(
        { '.empty-content': { content: '""' } },
        [
          'before',
          'after'
        ]
      );

      // MEMO: inspired by https://tailwindcss.com/docs/adding-base-styles#using-a-plugin
      addBase({ body: { fontFamily: theme('fontFamily.poppins') } });

      // TODO: check https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-842443438
      // MEMO: inspired by https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-610907147
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls(decl => {
            decl.important = true;
          });
        });
      });
    })
  ]
};

