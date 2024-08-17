module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.js',
    'vitest.config.ts',
    'src/apis/**/*.ts',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: {
    files: '*.stories.@(ts|tsx|js)',
    extends: ['plugin:storybook/recommended'],
    rules: {
      // default export を許可する
      'import/no-default-export': off,
      // devDependencies からの import を許可する
      'import/no-extraneous-dependencies': off,
    },
  },
};
