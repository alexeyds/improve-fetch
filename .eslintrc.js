module.exports = {
  "env": {
      "es6": true,
      "node": true
  },
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  }, 
  "extends": ["eslint:recommended"],
  "rules": {
     "no-unused-vars": [2, {"args": "all", "argsIgnorePattern": "^_"}],
      "indent": [
          "error",
          2, { "SwitchCase": 1 }
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "semi": [
          "error",
          "always"
      ]
  }
};