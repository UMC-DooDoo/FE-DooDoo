import axios from "axios";
//#region src/types/api.ts
/**
* 서버가 isSuccess=false 를 주거나 HTTP 에러가 났을 때 던지는 에러.
* code/message 는 백엔드 ErrorCode 규약을 그대로 담는다.
*/
var ApiError = class extends Error {
	code;
	status;
	constructor(code, message, status) {
		super(message);
		this.name = "ApiError";
		this.code = code;
		this.status = status;
	}
};
//#endregion
//#region src/api/axiosInstance.ts
var axiosInstance = axios.create({
	baseURL: "",
	headers: { "Content-Type": "application/json" },
	timeout: 1e4
});
axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
/**
* 재발급 요청이 여러 개 동시에 401 을 맞아도 /auth/reissue 는 한 번만 나가도록,
* 진행 중인 재발급 Promise 를 공유한다.
*/
var refreshPromise = null;
function refreshAccessToken() {
	if (!refreshPromise) refreshPromise = (async () => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");
		const next = (await axiosInstance.post("/auth/reissue", {
			accessToken,
			refreshToken
		})).data.result;
		localStorage.setItem("accessToken", next.accessToken);
		localStorage.setItem("refreshToken", next.refreshToken);
		return next.accessToken;
	})().finally(() => {
		refreshPromise = null;
	});
	return refreshPromise;
}
function clearSessionAndRedirect() {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("userId");
	window.location.href = "/login";
}
axiosInstance.interceptors.response.use((response) => {
	const body = response.data;
	if (body && body.isSuccess === false) throw new ApiError(body.code, body.message, response.status);
	return response;
}, async (error) => {
	const config = error.config;
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
			return Promise.reject(new ApiError("SESSION_EXPIRED", "로그인이 만료되었습니다. 다시 로그인해주세요.", 401));
		}
	}
	const body = error.response?.data;
	if (body?.code) throw new ApiError(body.code, body.message, error.response?.status);
	throw new ApiError("NETWORK_ERROR", error.message ?? "네트워크 오류가 발생했습니다.", error.response?.status);
});
/**
* 봉투를 벗겨 result 만 반환하는 헬퍼.
* api 함수에서 `return unwrap(axiosInstance.get(...))` 형태로 쓴다.
*/
async function unwrap(promise) {
	return (await promise).data.result;
}
//#endregion
export { axiosInstance, axiosInstance as default, unwrap };
