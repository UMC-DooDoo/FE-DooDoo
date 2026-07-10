import type { ReactNode } from "react";
import ConfirmModal from "../common/ConfirmModal";

interface PhoneFrameProps {
  children: ReactNode;
}

/** 모바일 프레임 셸. 데스크톱에서는 바깥이 회색, 안쪽 430px만 흰 배경.
 * 하단 탭이 있는 화면(AppLayout)과 없는 화면(로그인·회원가입)이 모두 공유한다.
 * ConfirmModal 도 여기서 한 번만 마운트해 모든 화면에서 confirmModal() 을 쓸 수 있게 한다. */
function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-neutral-100">
      <div className="bg-bg relative flex min-h-dvh w-full max-w-[430px] flex-col">
        {children}
        <ConfirmModal />
      </div>
    </div>
  );
}

export default PhoneFrame;
