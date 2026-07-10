import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import CheckPoint from "../components/common/CheckPoint";
import PhoneFrame from "../components/layout/PhoneFrame";
import { signup } from "../api/auth";
import { ApiError } from "../types/api";

function SignupPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 아이디: 영문, 숫자, 문자 등 4자 이상
  const idValid = id.length >= 4;
  const idError = id.length > 0 && !idValid;

  // 비밀번호: 8자 이상 + 숫자 포함 + 문자 포함
  const pwLong = password.length >= 8;
  const pwHasNumber = /\d/.test(password);
  const pwHasLetter = /[a-zA-Z가-힣]/.test(password);
  const pwValid = pwLong && pwHasNumber && pwHasLetter;
  const pwError = password.length > 0 && !pwValid;

  // 닉네임: 1~12자
  const nickValid = nickname.length >= 1 && nickname.length <= 12;
  const nickError = nickname.length > 12;

  const canSubmit = idValid && pwValid && nickValid;

  async function handleSignup() {
    setError("");
    setLoading(true);
    try {
      await signup(id, password, nickname);
      navigate("/login");
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "회원가입 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col gap-8 px-5 py-10">
        {/* 1단계: 아이디 */}
        <section className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-neutral-600">1단계 : 아이디</p>
          <h2 className="text-lg font-bold">사용할 아이디를 입력해주세요</h2>
          <p className="text-xs text-neutral-400">영문, 숫자, 문자 등 4자 이상</p>
          <Input
            className="mt-3"
            placeholder="아이디를 입력해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            error={idError}
          />
          <div className="mt-1.5 min-h-4">
            {idError && (
              <p className="text-xs text-danger">아이디는 4자 이상이어야 해요</p>
            )}
            {idValid && <CheckPoint text="사용가능한 아이디예요" />}
          </div>
        </section>

        {/* 2단계: 비밀번호 */}
        <section className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-neutral-600">2단계 : 비밀번호</p>
          <h2 className="text-lg font-bold">사용할 비밀번호를 입력해주세요</h2>
          <p className="text-xs text-neutral-400">8자 이상 숫자, 문자를 포함해야 해요</p>
          <Input
            className="mt-3"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={pwError}
          />
          <div className="mt-1.5 flex gap-3">
            <CheckPoint text="8자 이상" status={pwLong ? "valid" : "idle"} />
            <CheckPoint text="숫자 포함" status={pwHasNumber ? "valid" : "idle"} />
            <CheckPoint text="문자 포함" status={pwHasLetter ? "valid" : "idle"} />
          </div>
        </section>

        {/* 3단계: 닉네임 */}
        <section className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-neutral-600">3단계 : 닉네임</p>
          <h2 className="text-lg font-bold">사용할 닉네임을 입력해주세요</h2>
          <p className="text-xs text-neutral-400">
            앱에서 사용할 닉네임을 입력해주세요 (1~12자)
          </p>
          <Input
            className="mt-3"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={nickError}
          />
          <div className="mt-1.5 min-h-4">
            {nickError && (
              <p className="text-xs text-danger">닉네임은 12자 이하여야 해요</p>
            )}
            {nickValid && <CheckPoint text="사용가능한 닉네임이에요" />}
          </div>
        </section>

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button disabled={!canSubmit || loading} onClick={handleSignup}>
          {loading ? "가입 중..." : "회원가입"}
        </Button>
      </div>
    </PhoneFrame>
  );
}

export default SignupPage;
