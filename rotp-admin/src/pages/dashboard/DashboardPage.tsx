import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("dashboard.title")}</h2>
          <p className="page__description">
            {t("dashboard.description")}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">{t("dashboard.summaryTitle")}</h3>
          <p className="card__subtitle">
            {t("dashboard.summarySubtitle")}
          </p>
        </div>
        <p style={{ margin: 0 }}>
          {/* 나중에 통계/상태 카드들 배치 예정 */}
        </p>
      </div>
    </div>
  );
}