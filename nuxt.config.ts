import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    modules: [
        '@primevue/nuxt-module',
        '@nuxt/test-utils/module',
        '@nuxtjs/i18n',
        '@nuxt/image',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxt/eslint',
        '@nuxt/fonts',
    ],
    devtools: { enabled: true },
    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
            title: 'Ryan Mulready',
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Nuxt Boilerplate',
                },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        },
    },
    css: ['~/scss/main.scss'],
    compatibilityDate: '2024-11-01',
    i18n: {
        locales: [
            {
                code: 'en',
                file: 'en.json',
            },
        ],
        vueI18n: './i18n.config.ts',
    },
    primevue: {
        options: {
            ripple: true,
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.dark-mode',
                },
            },
        },
    },
});
