module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest": true
    },
    "globals": {
      "_": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8
    },
    "rules": {
        "import/prefer-default-export": ["off"],
        "indent": [
            "error",
            2
        ],
        "no-console": 0,
        "comma-dangle": [
          "error", "never"
        ],
        "no-param-reassign": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
