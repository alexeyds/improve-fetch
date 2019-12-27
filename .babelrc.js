module.exports = {
  "presets": [
    [ 
      "@babel/preset-env"
    ]
  ],

  "plugins": [
    [
      "module-resolver",
      {
        "root": [
          "./lib"
        ],
        "alias": {
          "test": "./test"
        }
      }
    ]
  ],

  "ignore": ["dist"]
}