import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/locales/en/common.json";
import ko from "../assets/locales/ko/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    ko: { common: ko }
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false }
});

export default i18n;
