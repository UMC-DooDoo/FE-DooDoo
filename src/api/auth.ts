// 인증 API. 엔드포인트: /auth/* (BE: 김유진)

import { axiosInstance, unwrap } from "./axiosInstance";

interface LoginResult {
  memberId: number;
  accessToken: string;
  refreshToken: string;
}

interface SignupResult {
  memberId: number;
}

/** 로그인 — POST /auth/login. 성공 시 토큰·memberId 저장 */
export async function login(signupId: string, password: string) {
  const res = await unwrap<LoginResult>(
    axiosInstance.post("/auth/login", { signupId, password }),
  );
  localStorage.setItem("accessToken", res.accessToken);
  localStorage.setItem("refreshToken", res.refreshToken);
  localStorage.setItem("userId", String(res.memberId));
  return res;
}

/** 회원가입 — POST /auth/signup */
export async function signup(
  signupId: string,
  password: string,
  nickname: string,
) {
  return unwrap<SignupResult>(
    axiosInstance.post("/auth/signup", { signupId, password, nickname }),
  );
}

/** 로그아웃 — POST /auth/logout. 토큰 정리 */
export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    await unwrap<null>(axiosInstance.post("/auth/logout", { refreshToken }));
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }
}

// 토큰 재발급(POST /auth/reissue)은 axiosInstance 의 401 응답 인터셉터가
// 자동으로 처리한다 — 여기서 따로 호출할 필요 없다.

/** 로그인 여부(토큰 존재) */
export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}
