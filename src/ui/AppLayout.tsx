import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
import AppSidebar from "../components/AppSidebar";

const AppLayout = () => {
  return (
    <>
      <AppSidebar />
      <main className="bg-gray-200 w-full px-4 py-6 text-center">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
