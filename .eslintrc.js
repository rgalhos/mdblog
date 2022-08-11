// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'default-param-last': 'error',
        eqeqeq: 'warn',
        'prefer-const': 'error',
        radix: 'warn',
        'no-eval': 'error',
        'no-constructor-return': 'error',
        'no-script-url': 'error',
        'no-sequences': 'error',
        'no-var': 'error',
        'no-useless-escape': 'off',
        'no-debugger': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
            },
        ],
    },
    ignorePatterns: ['public/*.js'],
};
