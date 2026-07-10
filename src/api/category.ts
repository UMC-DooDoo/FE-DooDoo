// ⚠️ 템플릿 파일 — 실제 엔드포인트/필드는 백엔드 API 명세 받으면 맞춰 수정.
// 지금은 문서에 나온 카테고리 응답 예시( categoryId, categoryName, color )만 반영해 둔 상태.

import { axiosInstance, unwrap } from "./axiosInstance";
import { toAccentColor, toServerColor } from "../constants/category";
import type { AccentColor } from "../constants/category";
import type { Category } from "../types/todo";

// 서버가 내려주는 원본 형태(DTO)
interface CategoryDto {
  categoryId: number;
  categoryName: string;
  color: string; // "BLUE" 같은 대문자 enum
}

// DTO -> 화면에서 쓰는 도메인 타입으로 변환
function toCategory(dto: CategoryDto): Category & { id: number } {
  return {
    id: dto.categoryId,
    name: dto.categoryName,
    color: toAccentColor(dto.color),
  };
}

/** 분야 목록 조회 — TODO: 경로 확인 (예: GET /api/categories) */
export async function getCategories() {
  const list = await unwrap<CategoryDto[]>(axiosInstance.get("/categories"));
  return list.map(toCategory);
}

/** 분야 생성 — TODO: 경로/요청 필드 확인 (예: POST /api/categories) */
export async function createCategory(name: string, color: AccentColor) {
  const dto = await unwrap<CategoryDto>(
    axiosInstance.post("/categories", {
      categoryName: name,
      color: toServerColor(color),
    }),
  );
  return toCategory(dto);
}
