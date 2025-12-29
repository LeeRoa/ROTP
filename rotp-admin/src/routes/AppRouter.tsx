import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdminAccountListPage from "../pages/adminAccounts/AdminAccountsList";
import AdminAccountEditPage from "../pages/adminAccounts/AdminAccountsEdit";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/admin-accounts" element={<AdminAccountListPage />} />
            <Route path="/admin-accounts/:id" element={<AdminAccountEditPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
