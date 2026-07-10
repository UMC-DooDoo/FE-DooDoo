import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import StatsPage from "../pages/StatsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import RequireAuth from "./RequireAuth";
import RedirectIfAuthed from "./RedirectIfAuthed";

const router = createBrowserRouter([
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "stats", element: <StatsPage /> },
        ],
      },
      // 정의되지 않은 경로도 RequireAuth 아래 있어야, 로그인 안 했을 때
      // 어떤 주소로 들어와도 /login 으로 보내진다. 로그인한 상태면 홈으로.
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
