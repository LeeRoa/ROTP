import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "../components/layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdminAccountListPage from "../pages/adminAccounts/AdminAccountsList";
import AdminAccountEditPage from "../pages/adminAccounts/AdminAccountsEdit";
import OtpUserList from "../pages/otpUsers/OtpUsersList";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../routes/auth/ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Public Route: 로그인 페이지 (레이아웃 없음, 보호 없음) */}
                <Route path="/" element={<Login />} />

                {/* 2. Protected Routes: 로그인 해야만 접근 가능 */}
                <Route element={<ProtectedRoute />}>

                    {/* 3. Layout Route: 여기서 AppLayout을 적용합니다 */}
                    {/* 이렇게 하면 로그인 페이지는 레이아웃 영향을 안 받고, 아래 페이지들만 받습니다 */}
                    <Route element={<AppLayout><Outlet /></AppLayout>}>

                        <Route path="/main" element={<DashboardPage />} />
                        <Route path="/admin-accounts" element={<AdminAccountListPage />} />
                        <Route path="/admin-accounts/:id" element={<AdminAccountEditPage />} />
                        <Route path="/otp-users" element={<OtpUserList />} />

                    </Route>
                </Route>

                {/* 4. 잘못된 경로 처리 (선택사항) */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}