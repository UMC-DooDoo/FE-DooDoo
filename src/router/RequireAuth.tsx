import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

/** 로그인 안 했으면 /login 으로 보낸다. 하단 탭이 있는 화면들을 감싼다. */
function RequireAuth() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RequireAuth;
