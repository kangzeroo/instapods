module.exports = {
    root: true,
    extends: [
        '@react-native-community',
        'airbnb-typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        project: "tsconfig.json"
    },
    rules: {
        "react/jsx-props-no-spreading": 0,
        "react/jsx-boolean-value": 0,
        "no-underscore-dangle": 0,
        "import/prefer-default-export": 0,
        "jsx-a11y/accessible-emoji": 0,
        "@typescript-eslint/camelcase": 0,
        "global-require": 0,
        "@typescript-eslint/no-use-before-define": 0,
        "react/jsx-curly-brace-presence": 0,
        "eslint-comments/no-unlimited-disable": 0,
        "spaced-comment": 0
    }
}
