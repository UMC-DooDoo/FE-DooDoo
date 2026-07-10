// 분야(카테고리) API. 엔드포인트: /categories (BE: minwldnjs)

import { axiosInstance, unwrap } from "./axiosInstance";
import { toAccentColor, toServerColor } from "../constants/category";
import type { AccentColor } from "../constants/category";

interface CategoryDto {
  categoryId: number;
  categoryName: string;
  color: string; // "BLUE" 같은 대문자 enum
}

// GET /categories 는 배열이 아니라 이 래퍼로 온다.
interface CategoryListDto {
  memberId: number;
  totalCount: number;
  categories: CategoryDto[];
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

/** login()/getMe() 가 저장해 둔 로그인한 회원의 id */
function getMemberId(): string {
  const id = localStorage.getItem("userId");
  if (!id) throw new Error("로그인 정보가 없습니다.");
  return id;
}

/** 분야 목록 조회 — GET /categories?memberId={id} (result 는 { categories: [] } 래퍼) */
export async function getCategories(): Promise<CategoryItem[]> {
  const res = await unwrap<CategoryListDto>(
    axiosInstance.get("/categories", { params: { memberId: getMemberId() } }),
  );
  return res.categories.map(toCategory);
}

/**
 * 분야 생성 — POST /categories.
 * ⚠️ memberId 쿼리를 붙여도 다양한 color/필드명 조합에서 계속 CATEGORY400 이 나서,
 * 정확한 요청 스펙을 백엔드(minwldnjs)에 확인해야 한다. memberId 는 우선 붙여 둔다.
 */
export async function createCategory(name: string, color: AccentColor) {
  const dto = await unwrap<CategoryDto>(
    axiosInstance.post(
      "/categories",
      { categoryName: name, color: toServerColor(color) },
      { params: { memberId: getMemberId() } },
    ),
  );
  return toCategory(dto);
}

/** 분야 수정 — PATCH /categories/{categoryId} */
export async function updateCategory(
  categoryId: number,
  patch: { name?: string; color?: AccentColor },
) {
  const dto = await unwrap<CategoryDto>(
    axiosInstance.patch(
      `/categories/${categoryId}`,
      {
        categoryName: patch.name,
        color: patch.color ? toServerColor(patch.color) : undefined,
      },
      { params: { memberId: getMemberId() } },
    ),
  );
  return toCategory(dto);
}

/** 분야 삭제 — DELETE /categories/{categoryId} */
export async function deleteCategory(categoryId: number) {
  return unwrap<null>(
    axiosInstance.delete(`/categories/${categoryId}`, {
      params: { memberId: getMemberId() },
    }),
  );
}
