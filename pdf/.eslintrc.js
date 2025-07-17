module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      env: {
        node: true,
        browser: true,
        es6: true,
        jest: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    'devops',
    'tests',
    'sonar-scan.js',
    'vitest.config.ts',
    '.eslintrc.js',
    'src/appInjector.js',
  ],
  plugins: ['react', 'react', 'react-hooks', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/triple-slash-reference': 'off',
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      }
    ],
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: true,
        },
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    'curly': ['error', 'multi-line'],
    'arrow-body-style': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/strict-boolean-expressions': [
      'warn',
      {
        'allowNullableObject': true,
        'allowNullableBoolean': true,
      }
    ]
  }
}