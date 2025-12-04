import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../assets/locales/en/common.json";
import ko from "../assets/locales/ko/common.json";

import enAdminAccount from "../assets/locales/en/adminAccount.json";
import koAdminAccount from "../assets/locales/ko/adminAccount.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { 
      common: en,
      adminAccount: enAdminAccount,
    },
    ko: { 
      common: ko,
      adminAccount: koAdminAccount,
     }
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false }
});

export default i18n;
