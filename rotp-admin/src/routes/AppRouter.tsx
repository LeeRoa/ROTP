import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout";
import DashboardPage from "../pages/dashboard/DashboardPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
