// 카테고리 색의 단일 소스. 점, 진행바, 칩이 모두 여기서 색을 받아간다.
// 기준: 통계 화면 디자인.

export const CATEGORIES = ['공부', '운동', '일', '집안일', '일정'] as const

export type Category = (typeof CATEGORIES)[number]

/** 진행바, 점, 칩 등에 쓰는 색 키. 사용자 정의 분야 색 선택지도 여기서 나온다. */
export type AccentColor =
  | 'blue'
  | 'green'
  | 'apricot'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'yellow'
  | 'red'
  | 'neutral'

/** 색 선택 팔레트(분야 추가 등)에 노출할 목록. neutral 은 UI 상태색이라 제외 */
export const ACCENT_COLORS: AccentColor[] = [
  'blue',
  'green',
  'apricot',
  'purple',
  'pink',
  'cyan',
  'yellow',
  'red',
]

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
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  neutral: 'bg-neutral-500',
}

export const ACCENT_TEXT: Record<AccentColor, string> = {
  blue: 'text-blue-400',
  green: 'text-green-500',
  apricot: 'text-apricot-300',
  purple: 'text-purple-500',
  pink: 'text-pink-500',
  cyan: 'text-cyan-500',
  yellow: 'text-yellow-500',
  red: 'text-red-500',
  neutral: 'text-neutral-500',
}

// ---- 서버 색상 enum 변환 ----
// 백엔드는 색을 대문자 enum("BLUE")으로 주고받는다고 가정한다.
// (실제 enum 값이 다르면 이 두 함수만 고치면 됨)

/** 프론트 색 키 -> 서버 enum. 예: 'blue' -> 'BLUE' */
export function toServerColor(accent: AccentColor): string {
  return accent.toUpperCase()
}

/** 서버 enum -> 프론트 색 키. 모르는 값은 neutral 로 폴백. 예: 'BLUE' -> 'blue' */
export function toAccentColor(server: string): AccentColor {
  const lower = server?.toLowerCase()
  return (ACCENT_COLORS as string[]).includes(lower)
    ? (lower as AccentColor)
    : 'neutral'
}
