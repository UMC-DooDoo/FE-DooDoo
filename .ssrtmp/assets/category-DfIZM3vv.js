import { axiosInstance, unwrap } from "./axiosInstance-DjLq8bJP.js";
//#region src/constants/category.ts
var ACCENT_TO_SERVER = {
	blue: "BLUE",
	green: "GREEN",
	apricot: "ORANGE",
	purple: "PURPLE",
	pink: "PINK",
	cyan: "CYAN",
	yellow: "YELLOW",
	red: "RED",
	neutral: "GRAY"
};
var SERVER_TO_ACCENT = Object.fromEntries(Object.entries(ACCENT_TO_SERVER).map(([accent, server]) => [server, accent]));
/** 프론트 색 키 -> 서버 enum. 예: 'apricot' -> 'ORANGE' */
function toServerColor(accent) {
	return ACCENT_TO_SERVER[accent] ?? "GRAY";
}
/** 서버 enum -> 프론트 색 키. 모르는 값은 neutral. 예: 'ORANGE' -> 'apricot' */
function toAccentColor(server) {
	return SERVER_TO_ACCENT[server?.toUpperCase()] ?? "neutral";
}
//#endregion
//#region src/api/category.ts
function toCategory(dto) {
	return {
		id: dto.categoryId,
		name: dto.categoryName,
		color: toAccentColor(dto.color)
	};
}
/** login()/getMe() 가 저장해 둔 로그인한 회원의 id */
function getMemberId() {
	const id = localStorage.getItem("userId");
	if (!id) throw new Error("로그인 정보가 없습니다.");
	return id;
}
/** 분야 목록 조회 — GET /categories?memberId={id} (result 는 { categories: [] } 래퍼) */
async function getCategories() {
	return (await unwrap(axiosInstance.get("/categories", { params: { memberId: getMemberId() } }))).categories.map(toCategory);
}
/** 분야 생성 — POST /categories. memberId 는 쿼리가 아니라 body 필드(숫자)로 보내야 한다. */
async function createCategory(name, color) {
	return toCategory(await unwrap(axiosInstance.post("/categories", {
		memberId: Number(getMemberId()),
		categoryName: name,
		color: toServerColor(color)
	})));
}
//#endregion
export { createCategory, getCategories };
