import { createConfigForNuxt } from '@nuxt/eslint-config';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';

export default createConfigForNuxt(
    {
        features: {
            stylistic: {
                semi: true,
                indent: 4,
                braceStyle: '1tbs',
            },
        },
    },
    ...vueI18n.configs['flat/recommended'],
    {
        settings: {
            'vue-i18n': {
                localeDir: './i18n/locales/*.json',
                messageSyntaxVersion: '^9.0.0',
            },
        },
    },
)
    .override('nuxt/vue/rules', {
        rules: {
            'vue/html-closing-bracket-newline': [
                'error',
                {
                    singleline: 'never',
                    multiline: 'never',
                },
            ],
        },
    })
    .prepend({
        rules: {
            curly: ['error'],
        },
    });
