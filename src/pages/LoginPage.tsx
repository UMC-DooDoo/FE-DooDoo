import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import PhoneFrame from "../components/layout/PhoneFrame";

function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // TODO: 로그인 API 연동
    navigate("/");
  }

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5">
        {/* 로고 + 타이틀 */}
        <div className="flex flex-col items-center gap-3 pt-20 pb-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white shadow-lg">
            <img src="/favicon.svg" alt="DooDoo" className="h-9 w-9" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">DooDoo</h1>
            <p className="mt-1 text-xs text-neutral-400">계속하려면 로그인하세요</p>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-600">아이디</span>
            <Input
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-600">비밀번호</span>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <Button
          className="mt-8"
          disabled={!id || !password}
          onClick={handleLogin}
        >
          로그인
        </Button>

        {/* 회원가입 안내 카드 */}
        <Card className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">아직 계정이 없으신가요?</p>
            <p className="text-xs text-neutral-400">지금 바로 가입하고 시작하세요</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm"
          >
            회원가입
          </button>
        </Card>
      </div>
    </PhoneFrame>
  );
}

export default LoginPage;
