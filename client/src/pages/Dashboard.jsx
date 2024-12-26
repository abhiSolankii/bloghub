import DashPosts from "@/components/DashPosts";
import DashProfile from "@/components/DashProfile";
import DashSetting from "@/components/DashSetting";
import DashSidebar from "@/components/DashSidebar";
import DashSupport from "@/components/DashSupport";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const tabComponents = {
    profile: <DashProfile />,
    setting: <DashSetting />,
    support: <DashSupport />,
    posts: <DashPosts />,
  };

  // Default to DashProfile if tab not found
  const CurrentTabComponent = tabComponents[tab] || <DashProfile />;

  return (
    <div className="lg:flex lg:flex-row">
      <div>
        <DashSidebar />
      </div>
      <div className="w-full">{CurrentTabComponent}</div>
    </div>
  );
};

export default Dashboard;
