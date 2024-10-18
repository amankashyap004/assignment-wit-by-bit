import type { Metadata } from "next";
import DashboardLayout from "./DashboardLayout";
import Tabs from "./Tabs";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Tabs />
    </DashboardLayout>
  );
};

export default Dashboard;
