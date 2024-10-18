"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductManagement from "@/components/product/ProductManagement";

const Tabs = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("products");

  const tab = searchParams.get("tab");
  useEffect(() => {
    if (tab) {
      setActiveTab(tab as string);
    }
  }, [tab]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <div>Home</div>;
      case "products":
        return <ProductManagement />;
      case "store":
        return <div>Store Information</div>;
      case "catalogue":
        return <div>Catalogue Information</div>;
      case "promotion":
        return <div>Promotion Information</div>;
      case "reports":
        return <div>Reports Section</div>;
      case "docs":
        return <div>Docs Section</div>;
      case "settings":
        return <div>Settings Section</div>;
      default:
        return <div>Product List will be here.</div>;
    }
  };

  return <div className="p-8 w-full h-full">{renderContent()}</div>;
};

export default Tabs;
