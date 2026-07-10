// 분야(카테고리) API. 엔드포인트: /categories (BE: minwldnjs)

import { axiosInstance, unwrap } from "./axiosInstance";
import { toAccentColor, toServerColor } from "../constants/category";
import type { AccentColor } from "../constants/category";

interface CategoryDto {
  categoryId: number;
  categoryName: string;
  color: string; // "BLUE" 같은 대문자 enum
}

export interface CategoryItem {
  id: number;
  name: string;
  color: AccentColor;
}

function toCategory(dto: CategoryDto): CategoryItem {
  return {
    id: dto.categoryId,
    name: dto.categoryName,
    color: toAccentColor(dto.color),
  };
}

/** 분야 목록 조회 — GET /categories (result 는 배열) */
export async function getCategories(): Promise<CategoryItem[]> {
  const list = await unwrap<CategoryDto[]>(axiosInstance.get("/categories"));
  return list.map(toCategory);
}

/** 분야 생성 — POST /categories */
export async function createCategory(name: string, color: AccentColor) {
  const dto = await unwrap<CategoryDto>(
    axiosInstance.post("/categories", {
      categoryName: name,
      color: toServerColor(color),
    }),
  );
  return toCategory(dto);
}

/** 분야 수정 — PATCH /categories/{categoryId} */
export async function updateCategory(
  categoryId: number,
  patch: { name?: string; color?: AccentColor },
) {
  const dto = await unwrap<CategoryDto>(
    axiosInstance.patch(`/categories/${categoryId}`, {
      categoryName: patch.name,
      color: patch.color ? toServerColor(patch.color) : undefined,
    }),
  );
  return toCategory(dto);
}

/** 분야 삭제 — DELETE /categories/{categoryId} */
export async function deleteCategory(categoryId: number) {
  return unwrap<null>(axiosInstance.delete(`/categories/${categoryId}`));
}
