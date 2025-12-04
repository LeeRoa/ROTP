// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      layout: {
        sidebar: {
          menuDashboard: "Dashboard",
          menuOtpUsers: "OTP Users",
          menuAuditLogs: "Audit Logs",
          menuAdminAccounts: "Admin Accounts",
        },
        header: {
          title: "OTP Administration Console",
          subtitle: "Centralized security management for OTP service.",
        },
      },
      common: {
        languageKo: "Korean",
        languageEn: "English",
        loading: "Loading...",
        emptyData: "No data available.",
        search: "Search",
        create: "Create",
        save: "Save",
        cancel: "Cancel",
      },
      dashboard: {
        title: "Dashboard",
        description: "Overview of OTP server status and security metrics.",
        summaryTitle: "Summary",
        summarySubtitle: "Key metrics will be displayed here later.",
      },
      otpUser: {
        title: "OTP User Management",
        description: "Manage OTP users, enrollment, and bypass settings.",
      },
      auditLog: {
        title: "Audit Logs",
        description: "View and search security-related audit logs.",
      },
      adminAccount: {
        title: "Admin Accounts",
        description: "Manage SUPER_ADMIN and ADMIN accounts and permissions.",
      },
    },
  },
  ko: {
    translation: {
      layout: {
        sidebar: {
          menuDashboard: "대시보드",
          menuOtpUsers: "OTP 사용자",
          menuAuditLogs: "감사 로그",
          menuAdminAccounts: "관리자 계정",
        },
        header: {
          title: "OTP 관리자 콘솔",
          subtitle: "OTP 서비스를 위한 중앙 집중식 보안 관리 콘솔입니다.",
        },
      },
      common: {
        languageKo: "한국어",
        languageEn: "영어",
        loading: "로딩 중...",
        emptyData: "데이터가 없습니다.",
        search: "검색",
        create: "등록",
        save: "저장",
        cancel: "취소",
      },
      dashboard: {
        title: "대시보드",
        description: "OTP 서버 상태와 보안 지표를 한눈에 확인합니다.",
        summaryTitle: "요약 정보",
        summarySubtitle: "추후 주요 지표를 이 영역에 표시합니다.",
      },
      otpUser: {
        title: "OTP 사용자 관리",
        description: "OTP 사용자 등록, 조회, Bypass 설정 등을 관리합니다.",
      },
      auditLog: {
        title: "감사 로그",
        description: "보안 관련 감사 로그를 조회하고 검색합니다.",
      },
      adminAccount: {
        title: "관리자 계정",
        description:
          "SUPER_ADMIN / ADMIN 계정을 관리하고 권한을 설정합니다.",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ko",
    supportedLngs: ["ko", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;