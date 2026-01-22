// src/types/auth.ts

// 로그인 요청 DTO
export interface LoginRequest {
    username: string;
    password: string;
    uuid: string;
}

// 로그인 응답 DTO (서버에서 주는 토큰 구조에 맞춰 수정 필요)
export interface LoginResponse {
    accessToken: string;
    refreshToken: string; // 리프레시 토큰이 있다면 추가
    tokenType: string;    // 예: "Bearer"
    expiresIn: number;    // 만료 시간 (선택 사항)
}