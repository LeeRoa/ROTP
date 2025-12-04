// src/api/http.ts
import axios from "axios";

export const http = axios.create({
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  // 추후 토큰 인증 필요하면 여기에서 헤더 설정
  // const token = localStorage.getItem("accessToken");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error", error);
    return Promise.reject(error);
  }
);