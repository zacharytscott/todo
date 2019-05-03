module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    "prettier"
  ],
  parser: "babel-eslint",
  rules: {
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/no-unescaped-entities": ["off"],
    "no-underscore-dangle" : ["off"],
    "react/destructuring-assignment" : ["off"],
    "react/jsx-one-expression-per-line" : ["off"]
  }
};
