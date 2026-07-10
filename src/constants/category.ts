// 카테고리 색의 단일 소스. 점, 진행바, 칩이 모두 여기서 색을 받아간다.
// 기준: 통계 화면 디자인.

export const CATEGORIES = ['공부', '운동', '일', '집안일', '일정'] as const

export type Category = (typeof CATEGORIES)[number]

/** 진행바, 점 등 강조 요소에 쓰는 색 키 */
export type AccentColor =
  | 'blue'
  | 'green'
  | 'apricot'
  | 'purple'
  | 'red'
  | 'neutral'

export const CATEGORY_COLOR: Record<Category, AccentColor> = {
  공부: 'blue',
  운동: 'green',
  일: 'apricot',
  집안일: 'purple',
  일정: 'red',
}

// Tailwind 는 클래스명을 정적으로 스캔하므로 `bg-${color}` 처럼 조합하면 안 된다.
export const ACCENT_BG: Record<AccentColor, string> = {
  blue: 'bg-blue-400',
  green: 'bg-green-500',
  apricot: 'bg-apricot-300',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  neutral: 'bg-neutral-500',
}

export const ACCENT_TEXT: Record<AccentColor, string> = {
  blue: 'text-blue-400',
  green: 'text-green-500',
  apricot: 'text-apricot-300',
  purple: 'text-purple-500',
  red: 'text-red-500',
  neutral: 'text-neutral-500',
}
