import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
       <div className="sidebar__brand">
        <div className="sidebar__brand-logo">
          {/* 나중에 실제 로고 파일 이름에 맞게 src 변경 */}
          <img src="/logo.png" alt="OTP Admin Logo" />
        </div>
        <div className="sidebar__brand-text">
          <div className="sidebar__logo">ROTP Admin</div>
          <div className="sidebar__sub">
            Security Management Console
          </div>
        </div>
      </div>

      <div className="sidebar__section-label">Navigation</div>
      <nav className="sidebar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          {t("layout.sidebar.menuDashboard")}
        </NavLink>

        <NavLink
          to="/otp-users"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          {t("layout.sidebar.menuOtpUsers")}
        </NavLink>

        <NavLink
          to="/audit-logs"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          {t("layout.sidebar.menuAuditLogs")}
        </NavLink>

        <NavLink
          to="/admin-accounts"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          {t("layout.sidebar.menuAdminAccounts")}
        </NavLink>
      </nav>
    </aside>
  );
}