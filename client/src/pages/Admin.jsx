import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import AdminUsers from "@/components/AdminUsers";
import AdminPosts from "@/components/AdminPosts";
import DashSidebar from "@/components/DashSidebar";

const Admin = () => {
  const location = useLocation();

  const [admintab, setAdmintab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("admintab");
    if (tabFromUrl) setAdmintab(tabFromUrl);
  }, [location.search]);

  const tabComponents = {
    users: <AdminUsers />,
    posts: <AdminPosts />,
  };

  // Default to DashProfile if tab not found
  const CurrentTabComponent = tabComponents[admintab] || <AdminUsers />;
  return (
    <div className="flex">
      <DashSidebar />
      <div>
        <div className="flex gap-4 justify-center pt-10">
          <Link
            to="/admin?admintab=users"
            className={`p-2 ${
              admintab === "users" || null
                ? "bg-gray-500 text-white"
                : "bg-gray-300"
            } font-serif font-[500] rounded-sm hover:bg-gray-400 px-4 transition-all hover:translate-y-[-2px] delay-150`}
            onClick={() => setAdmintab("users")}
          >
            Users
          </Link>
          <Link
            to="/admin?admintab=posts"
            className={`p-2 ${
              admintab === "posts" ? "bg-gray-500 text-white" : "bg-gray-300"
            } font-serif font-[500] rounded-sm hover:bg-gray-400 px-4 transition-all hover:translate-y-[-2px] delay-150`}
            onClick={() => setAdmintab("posts")}
          >
            Posts
          </Link>
        </div>
        {CurrentTabComponent}
      </div>
    </div>
  );
};

export default Admin;
