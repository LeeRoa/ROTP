import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OtpUserListPage from "../pages/otpUser/OtpUserListPage";
import AuditLogListPage from "../pages/auditLog/AuditLogListPage.tsx";
import AdminAccountListPage from "../pages/adminAccount/AdminAccountListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "otp-users", element: <OtpUserListPage /> },
      { path: "audit-logs", element: <AuditLogListPage /> },
      { path: "admin-accounts", element: <AdminAccountListPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}