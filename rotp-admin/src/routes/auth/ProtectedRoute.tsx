import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    // 1. 토큰 확인 (키 이름은 저장할 때 쓴 것과 같아야 합니다)
    const isAuthenticated = !!localStorage.getItem("accessToken");

    // 현재 위치 저장 (로그인 후 원래 가려던 페이지로 돌려보내기 위함 - 선택사항)
    const location = useLocation();

    if (!isAuthenticated) {
        // 토큰이 없으면 로그인 페이지로 이동
        // replace: 뒤로가기 눌렀을 때 다시 이 페이지로 오지 않도록 기록 교체
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 토큰이 있으면 하위 라우트(Outlet) 렌더링
    return <Outlet />;
}