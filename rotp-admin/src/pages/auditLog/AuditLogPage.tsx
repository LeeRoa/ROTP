import { useTranslation } from "react-i18next";

export default function AuditLogListPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("auditLog.title")}</h2>
          <p className="page__description">
            {t("auditLog.description")}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">{t("auditLog.title")}</h3>
          <p className="card__subtitle">
            {/* 나중에: 필터/검색 조건 설명 */}
          </p>
        </div>
        <p style={{ margin: 0 }}>
          {/* 감사 로그 테이블 자리 */}
        </p>
      </div>
    </div>
  );
}