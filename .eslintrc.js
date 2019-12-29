require("@babel/register");

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
    quotes: [2, "single", "avoid-escape"],
    "jsx-quotes": ["error", "prefer-double"],
    "object-curly-newline": ["error", { consistent: true }],
    // "react/jsx-max-props-per-line": [1, { maximum: 1, when: "multiline" }],
    "object-property-newline": [
      "error",
      { allowMultiplePropertiesPerLine: true }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  },
  settings: {
    "import/resolver": {
      "webpack": {
        "config": {
          "resolve": {
            "modules": ["node_modules"]
          } 
        }
      }
    },
  }
};
