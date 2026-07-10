import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
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

interface RetriableConfig extends InternalAxiosRequestConfig {
  /** 이 요청으로 이미 재발급을 한 번 시도했는지 — 무한 재시도 방지 */
  _retry?: boolean;
}

/**
 * 재발급 요청이 여러 개 동시에 401 을 맞아도 /auth/reissue 는 한 번만 나가도록,
 * 진행 중인 재발급 Promise 를 공유한다.
 */
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

      const res = await axiosInstance.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >("/auth/reissue", { accessToken, refreshToken });

      const next = res.data.result;
      localStorage.setItem("accessToken", next.accessToken);
      localStorage.setItem("refreshToken", next.refreshToken);
      return next.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function clearSessionAndRedirect() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  // axios 인터셉터는 React 컴포넌트 트리 밖이라 useNavigate 를 못 쓴다.
  // 세션이 완전히 끊긴 상황이니 새로고침 겸 하드 리다이렉트로 로그인 화면으로 보낸다.
  window.location.href = "/login";
}

// 응답 인터셉터: 공통 봉투를 검사한다.
// - HTTP 200 이지만 isSuccess=false 면 ApiError 로 던진다.
// - HTTP 4xx/5xx 도 서버가 실어 준 code/message 를 그대로 ApiError 로 던진다.
// - 401 이면 /auth/reissue 로 액세스 토큰을 재발급받아 원래 요청을 한 번 재시도한다.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;
    if (body && body.isSuccess === false) {
      throw new ApiError(body.code, body.message, response.status);
    }
    return response;
  },
  async (error) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isReissueCall = config?.url?.includes("/auth/reissue");

    if (status === 401 && config && !config._retry && !isReissueCall) {
      config._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(config);
      } catch {
        clearSessionAndRedirect();
        return Promise.reject(
          new ApiError(
            "SESSION_EXPIRED",
            "로그인이 만료되었습니다. 다시 로그인해주세요.",
            401,
          ),
        );
      }
    }

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
