import { http } from "./http";
import type { OtpUser, PagedResult } from "../types/otpUser";

export interface OtpUserSearchParams {
  page?: number;      // 1-based로 쓸 예정
  size?: number;      // 페이지 크기
  keyword?: string;
  status?: string;
}

export const otpUserApi = {
  async list(params: OtpUserSearchParams) {
    const res = await http.get<PagedResult<OtpUser>>("/otp-users", { params });
    return res.data;
  },

  async updateBypass(id: string, bypass: boolean) {
    // 서버 스펙에 맞게 method / URL 조정
    const res = await http.patch<OtpUser>(`/otp-users/${id}/bypass`, { bypass });
    return res.data;
  },
};