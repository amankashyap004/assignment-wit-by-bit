import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex w-full h-screen px-4">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
