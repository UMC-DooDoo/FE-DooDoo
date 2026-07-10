import { QueryClient } from "@tanstack/react-query";

// 앱 전역 react-query 설정. 서버 상태 캐싱/재요청 정책을 여기서 관리한다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30초 동안은 캐시를 신선하다고 보고 재요청 안 함
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
