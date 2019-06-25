module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "class-methods-use-this": 0,
    "no-extend-native": 0,
    "no-param-reassign": 0,
    "max-len": [1, 120],
  },
  env: {
    browser: true,
    node: true,
  },
  extends: "airbnb-base",
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"]
      }
    }
  },
  overrides: [
    {
      files: [
        "**/*.spec.ts"
      ],
      env: {
        jest: true
      },
      plugins: ["jest"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    }
  ],
};
