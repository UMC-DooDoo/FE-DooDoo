import { Outlet } from "react-router-dom";
import PhoneFrame from "./PhoneFrame";
import NavigationBar from "./NavigationBar";

function AppLayout() {
  return (
    <PhoneFrame>
      <main className="relative flex flex-1 flex-col">
        <Outlet />
      </main>
      <NavigationBar />
    </PhoneFrame>
  );
}

export default AppLayout;
