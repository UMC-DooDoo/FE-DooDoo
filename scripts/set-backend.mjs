#!/usr/bin/env node
// 백엔드 주소가 바뀔 때 vercel.json 과 .env(VITE_PROXY_TARGET)를 한 번에 갱신한다.
// 사용법: node scripts/set-backend.mjs http://새주소:포트
//   또는: npm run set-backend -- http://새주소:포트

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const newOrigin = process.argv[2];

if (!newOrigin || !/^https?:\/\/[^/]+$/.test(newOrigin)) {
  console.error("사용법: node scripts/set-backend.mjs http://새주소:포트");
  process.exit(1);
}

// ----- vercel.json: 안에 있는 origin 이 전부 같다는 가정 하에 통째로 치환 -----
const vercelPath = join(root, "vercel.json");
const vercelText = readFileSync(vercelPath, "utf8");
const origins = [...new Set(vercelText.match(/https?:\/\/[^/"]+/g) ?? [])];

if (origins.length === 0) {
  console.error("vercel.json 에서 백엔드 주소를 못 찾았습니다.");
  process.exit(1);
}
if (origins.length > 1) {
  console.error(
    `vercel.json 안에 서로 다른 주소가 ${origins.length}개 있어서 자동으로 못 바꿉니다: ${origins.join(", ")}\n직접 수정해주세요.`,
  );
  process.exit(1);
}

writeFileSync(vercelPath, vercelText.split(origins[0]).join(newOrigin));
console.log(`vercel.json: ${origins[0]} -> ${newOrigin}`);

// ----- .env: VITE_PROXY_TARGET 라인만 교체 -----
const envPath = join(root, ".env");
if (existsSync(envPath)) {
  const envText = readFileSync(envPath, "utf8");
  const updated = /^VITE_PROXY_TARGET=/m.test(envText)
    ? envText.replace(/^VITE_PROXY_TARGET=.*$/m, `VITE_PROXY_TARGET=${newOrigin}`)
    : envText + `\nVITE_PROXY_TARGET=${newOrigin}\n`;
  writeFileSync(envPath, updated);
  console.log(`.env: VITE_PROXY_TARGET -> ${newOrigin}`);
} else {
  console.log(
    ".env 파일이 없어서 건너뜁니다. .env.example 을 .env 로 복사해두면 다음부터 같이 갱신됩니다.",
  );
}

console.log("\n다음 단계:");
console.log("1. vercel.json 변경을 커밋 + push 해야 배포에 반영됩니다.");
console.log("2. 로컬 dev 서버(vite)는 재시작해야 새 .env 값을 읽습니다.");
