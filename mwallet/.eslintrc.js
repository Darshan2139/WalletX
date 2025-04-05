module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true
  },
  extends: [
    'react-app',
    'react-app/jest'
  ],
  globals: {
    chrome: 'readonly'
  }
}; 