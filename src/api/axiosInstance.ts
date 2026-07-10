import axios from "axios";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../types/api";
import { ApiError } from "../types/api";

// baseURL 을 비워 두면 같은 출처(localhost)로 요청 → Vite dev 프록시가
// 백엔드로 대신 전달(CORS 우회). 배포 시에는 .env 의 VITE_API_BASE_URL 로 절대주소 주입.
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// 요청 인터셉터: 로그인 토큰이 있으면 자동으로 Authorization 헤더에 실어 보낸다.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터: 공통 봉투를 검사한다.
// - HTTP 200 이지만 isSuccess=false 면 ApiError 로 던진다.
// - HTTP 4xx/5xx 도 서버가 실어 준 code/message 를 그대로 ApiError 로 던진다.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;
    if (body && body.isSuccess === false) {
      throw new ApiError(body.code, body.message, response.status);
    }
    return response;
  },
  (error) => {
    const body = error.response?.data as ApiResponse<unknown> | undefined;
    if (body?.code) {
      throw new ApiError(body.code, body.message, error.response?.status);
    }
    throw new ApiError(
      "NETWORK_ERROR",
      error.message ?? "네트워크 오류가 발생했습니다.",
      error.response?.status,
    );
  },
);

/**
 * 봉투를 벗겨 result 만 반환하는 헬퍼.
 * api 함수에서 `return unwrap(axiosInstance.get(...))` 형태로 쓴다.
 */
export async function unwrap<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
  const res = await promise;
  return res.data.result;
}

export default axiosInstance;
