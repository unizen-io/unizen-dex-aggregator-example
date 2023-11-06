module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'import',
    'simple-import-sort',
    'modules-newlines'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'react-app',
    'google'
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          'jsx',
          'global'
        ]
      }
    ],
    // TS ESLinting rules
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': [
      2,
      { argsIgnorePattern: '^_' }
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true
          }
        }
      }
    ],

    // JS ESLinting rules
    'comma-dangle': [
      'error',
      'never'
    ],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error'
        ]
      }
    ],
    indent: [
      'error',
      2
    ],
    'quote-props': [
      'error',
      'as-needed'
    ],
    'capitalized-comments': 'off',
    'max-len': [
      'error',
      { code: 130 } // 130 on GitHub, 80 on npmjs.org for README.md code blocks
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    'no-negated-condition': 'error',
    'spaced-comment': [
      'error',
      'always',
      { exceptions: ['/'] }
    ],
    'no-dupe-keys': 'error',
    eqeqeq: 'error',
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
        maxBOF: 1
      }
    ],
    'space-infix-ops': [
      'error',
      { int32Hint: false }
    ],
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'import/exports-last': 'error',
    'require-jsdoc': 0, // TODO: `0` for now but later should be on by being removed
    // "prettier/prettier": 2 // TODO: double-check

    // React ESLinting rules
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/jsx-first-prop-new-line': [
      'error',
      'multiline'
    ],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'always'
      }
    ],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never'
      }
    ],
    'react/jsx-curly-spacing': [
      'error',
      {
        when: 'never',
        children: true
      }
    ],
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ],
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'react/jsx-closing-bracket-location': [
      'error',
      {
        selfClosing: 'after-props',
        nonEmpty: 'after-props'
      }
    ],
    'react/jsx-props-no-multi-spaces': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // `react` first, `next` second, then packages starting with a character
          [
            '^react$',
            '^next',
            '^[a-z]',
            '^@',
            '^~'
          ],

          // Project defined order of imports
          [
            '^pages',
            '^parts',
            '^containers',
            '^components',
            '^config',
            '^helpers',
            '^utils',
            '^services',
            '^contexts',
            '^types',
            '^abis',
            '^assets',
            '^.+\\.s?css$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
            '^\\u0000'
          ]
        ]
      }
    ],
    'array-element-newline': [
      'error',
      {
        ArrayExpression: { minItems: 1 },
        ArrayPattern: { minItems: 1 }
      }
    ],
    'array-bracket-newline': [
      'error',
      { minItems: 2 }
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true },
        ObjectPattern: { multiline: true },
        ImportDeclaration: {
          multiline: true,
          minProperties: 2
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 2
        }
      }
    ],
    'modules-newlines/import-declaration-newline': 'warn',
    'modules-newlines/export-declaration-newline': 'warn'
  }
};

