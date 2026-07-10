import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

/** 이미 로그인했으면 / 로 보낸다. 로그인·회원가입 화면을 감싼다. */
function RedirectIfAuthed() {
  return isLoggedIn() ? <Navigate to="/" replace /> : <Outlet />;
}

export default RedirectIfAuthed;
