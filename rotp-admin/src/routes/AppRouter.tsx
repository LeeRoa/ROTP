import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AppLayout} from "../components/layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdminAccountListPage from "../pages/adminAccounts/AdminAccountsList";
import AdminAccountEditPage from "../pages/adminAccounts/AdminAccountsEdit";
import OtpUserList from "../pages/otpUsers/OtpUsersList.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/admin-accounts" element={<AdminAccountListPage/>}/>
                    <Route path="/admin-accounts/:id" element={<AdminAccountEditPage/>}/>
                    <Route path="/otp-users" element={<OtpUserList/>}/>
                </Routes>
            </AppLayout>
        </BrowserRouter>
    );
}
