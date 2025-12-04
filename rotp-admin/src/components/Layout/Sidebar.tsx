import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">OTP Admin</div>
      <div className="sidebar__sub">Security Management Console</div>

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