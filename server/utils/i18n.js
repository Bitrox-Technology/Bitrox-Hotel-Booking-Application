import { I18n } from "i18n";

const i18n = new I18n({
    locales: ["en", "sp", "hi"],
    defaultLocale: 'en',
    directory: "./messages",
    objectNotation: true,
    register: global
})

export { i18n }