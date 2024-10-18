"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("");

  const tab = searchParams.get("tab");
  useEffect(() => {
    if (tab) {
      setActiveTab(tab as string);
    } else {
      setActiveTab("products");
    }
  }, [tab]);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-between items-start w-full h-full border-r border-black border-opacity-10">
      <section className="w-full">
        <div className="mx-4 py-8 text-2xl font-bold border-b border-black border-opacity-10">
          Dashboard
        </div>
        <div>
          {sidebarItems.map((item) => {
            const lowerCaseItem = item.toLowerCase();
            const isActive = activeTab === lowerCaseItem;
            return (
              <div
                key={item}
                className={`flex items-center justify-start gap-2 px-6 py-2 my-2 cursor-pointer rounded-lg font-medium transition-all ease-in-out duration-300 ${
                  isActive
                    ? "bg-[#ECF7FF] text-[#1F8CD0]"
                    : "hover:bg-[#ECF7FF] hover:text-[#1F8CD0]"
                }`}
                onClick={() =>
                  router.push(`/dashboard?tab=${item.toLowerCase()}`)
                }
              >
                <div className="p-2 bg-[#F5F5F5] border border-black border-opacity-10 rounded" />
                {item}
              </div>
            );
          })}
        </div>
      </section>
      <section className="w-full">
        <div className="mx-4 py-8 border-t border-black border-opacity-10">
          <Button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;

const sidebarItems = [
  "Home",
  "Store",
  "Products",
  "Catalogue",
  "Promotion",
  "Reports",
  "Docs",
  "Settings",
];
