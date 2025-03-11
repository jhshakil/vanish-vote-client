import CreatePoll from "@/components/CreatePoll";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <CreatePoll />
      <Outlet />
    </div>
  );
};

export default MainLayout;
