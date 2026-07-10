import { createRequire } from "node:module";
//#region \0rolldown/runtime.js
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region ../../../../private/tmp/claude-501/-Users-yeop1108-Desktop-FE-DooDoo/31d80fb6-7506-4ae3-bf35-614aeebd77d3/scratchpad/verify_create.tsx
var store = /* @__PURE__ */ new Map();
global.localStorage = {
	getItem: (k) => store.get(k) ?? null,
	setItem: (k, v) => store.set(k, v),
	removeItem: (k) => store.delete(k)
};
global.window = { location: { href: "" } };
async function main() {
	const loginRes = JSON.parse(__require("node:fs").readFileSync("/private/tmp/claude-501/-Users-yeop1108-Desktop-FE-DooDoo/31d80fb6-7506-4ae3-bf35-614aeebd77d3/scratchpad/login_res.json", "utf8"));
	localStorage.setItem("accessToken", loginRes.result.accessToken);
	localStorage.setItem("userId", String(loginRes.result.memberId));
	const { axiosInstance } = await import("./assets/axiosInstance-DjLq8bJP.js");
	axiosInstance.defaults.baseURL = "http://13.125.246.1:8080";
	const { createCategory, getCategories } = await import("./assets/category-DfIZM3vv.js");
	console.log("=== createCategory() 실제 백엔드 호출 ===");
	const created = await createCategory(`검증분야_${Date.now()}`, "blue");
	console.log("생성 성공:", JSON.stringify(created, null, 2));
	console.log("\n=== getCategories() 로 방금 생성한 게 실제로 조회되는지 ===");
	const list = await getCategories();
	console.log(JSON.stringify(list, null, 2));
}
main().catch((e) => {
	console.error("FAIL", e.message ?? e);
	process.exit(1);
});
//#endregion
export {};
