import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardLayout from "./DashboardLayout";
import Tabs from "./Tabs";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = () => {
  return (
    <Suspense fallback="Loading...">
      <DashboardLayout>
        <Tabs />
      </DashboardLayout>
    </Suspense>
  );
};

export default Dashboard;
