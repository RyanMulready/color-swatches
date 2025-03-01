export default defineI18nConfig(() => ({
    legacy: false,
    locales: [
        {
            code: 'en',
            file: 'en.json',
        },
    ],
    lazy: true,
    defaultLocale: 'en',
}));
