import { useTranslation } from "react-i18next";

export default function AdminAccountListPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("adminAccount.title")}</h2>
          <p className="page__description">
            {t("adminAccount.description")}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">{t("adminAccount.title")}</h3>
          <p className="card__subtitle">
            {/* 나중에: SUPER_ADMIN / ADMIN 설명 */}
          </p>
        </div>
        <p style={{ margin: 0 }}>
          {/* 관리자 계정 리스트 및 권한 관리 UI 자리 */}
        </p>
      </div>
    </div>
  );
}