import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: "ko" | "en") => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{t("layout.header.title")}</h1>
        <p className="header__subtitle">{t("layout.header.subtitle")}</p>
      </div>
      <div className="header__right">
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => changeLanguage("ko")}
        >
          {t("common.languageKo")}
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => changeLanguage("en")}
        >
          {t("common.languageEn")}
        </button>
        <span className="header__user">Admin</span>
      </div>
    </header>
  );
}