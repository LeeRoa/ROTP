import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

const API_BASE = "http://localhost:8080";

function handleApiError(error: AxiosError) {
    const status = error.response?.status;

    switch (status) {
        case 400:
            notifications.show({
                title: "잘못된 요청입니다",
                message: "요청 형식이 올바르지 않습니다.",
                color: "yellow",
            });
            break;
        case 401:
            notifications.show({
                title: "로그인이 필요합니다",
                message: "세션이 만료되었습니다. 다시 로그인 해주세요.",
                color: "orange",
            });
            // 토큰 삭제 및 로그인 페이지로 리다이렉트
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("adminId");
            window.location.href = "/";
            break;
        case 403:
            notifications.show({
                title: "접근 권한 없음",
                message: "이 기능을 사용할 권한이 없습니다.",
                color: "red",
            });
            break;
        case 500:
            notifications.show({
                title: "서버 오류",
                message: "잠시 후 다시 시도해주세요.",
                color: "red",
            });
            break;
        default:
            notifications.show({
                title: "알 수 없는 오류",
                message: "문제가 발생했습니다.",
                color: "red",
            });
            break;
    }

    throw error;
}

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

async function request<T>(method: HttpMethod, url: string, params?: object): Promise<T> {

    //로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    // 헤더 객체 생성
    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await axios({
            method,
            url: API_BASE + url,
            headers, // [추가됨] axios 요청에 헤더 포함
            params: (method === "get" || method === "delete") ? params : undefined,
            data: (method === "post" || method === "put" || method === "patch") ? params : undefined,
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
}

// 개별 함수
export async function apiGet<T>(url: string, params?: object) {
    return request<T>("get", url, params);
}

export async function apiPost<T>(url: string, params?: object) {
    return request<T>("post", url, params);
}

export async function apiPut<T>(url: string, params?: object) {
    return request<T>("put", url, params);
}

export async function apiPatch<T>(url: string, params?: object) {
    return request<T>("patch", url, params);
}

export async function apiDelete<T>(url: string, params?: object) {
    return request<T>("delete", url, params);
}