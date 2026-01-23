import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../assets/locales/en/common.json";
import ko from "../assets/locales/ko/common.json";

import enAdminAccount from "../assets/locales/en/adminAccount.json";
import koAdminAccount from "../assets/locales/ko/adminAccount.json";

// 1. OTP 사용자용 JSON 파일을 import 하세요
import enOtpUser from "../assets/locales/en/otpUser.json";
import koOtpUser from "../assets/locales/ko/otpUser.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: en,
      adminAccount: enAdminAccount,
      otpUser: enOtpUser,
    },
    ko: {
      common: ko,
      adminAccount: koAdminAccount,
      // 2. ko 섹션에도 반드시 등록해야 한국어 화면에서 보입니다!
      otpUser: koOtpUser,
    }
  },
  lng: "ko",
  fallbackLng: "ko",
  ns: ["common", "adminAccount", "otpUser"],
  defaultNS: "common",
  interpolation: { escapeValue: false }
});

export default i18n;