// 백엔드 공통 응답 형식.
// 모든 응답은 이 봉투로 감싸져 온다: { isSuccess, code, message, result }

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string; // 예: "COMMON200", "USER404"
  message: string;
  result: T; // 실제 데이터 (없으면 null)
}

/**
 * 서버가 isSuccess=false 를 주거나 HTTP 에러가 났을 때 던지는 에러.
 * code/message 는 백엔드 ErrorCode 규약을 그대로 담는다.
 */
export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
