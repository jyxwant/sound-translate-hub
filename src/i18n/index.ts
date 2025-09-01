import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";
import pt from "./locales/pt.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      fr: { translation: fr },
      es: { translation: es },
      ru: { translation: ru },
      ar: { translation: ar },
      pt: { translation: pt },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;