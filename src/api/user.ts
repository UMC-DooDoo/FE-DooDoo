// 유저 API. 엔드포인트: /members/me (BE: 김유진)

import { axiosInstance, unwrap } from "./axiosInstance";

export interface Member {
  memberId: number;
  nickname: string;
}

/**
 * 내 정보 조회 — GET /members/me.
 * todos·calendar 쿼리에 memberId(=userId)가 필요해 저장해 둔다.
 */
export async function getMe() {
  const me = await unwrap<Member>(axiosInstance.get("/members/me"));
  localStorage.setItem("userId", String(me.memberId));
  return me;
}
