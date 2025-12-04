import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdminAccountListPage from "../pages/adminAccounts/AdminAccountsList";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/admin-accounts" element={<AdminAccountListPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
