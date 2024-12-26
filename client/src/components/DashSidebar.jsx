import { useState, useEffect } from "react";

//schadcm import
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaBook,
  FaCog,
  FaLifeRing,
  FaLock,
  FaMailBulk,
  FaSignOutAlt,
  FaUserAlt,
} from "react-icons/fa";
import {
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);
  console.log(location);
  const { currentUser, loading } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await apiRequest.post("/auth/signout");
      dispatch(signOutSuccess());
      navigate("/sign-in");
      toast.success(res.data?.message || "Signed out successfully");
    } catch (error) {
      console.error("Error in signing out: ", error.message);
      dispatch(
        signOutFailure(error.response?.data?.message || "Error in signing out")
      );
    }
  };
  return (
    <div>
      <div className="w-full h-full lg:w-[20rem] lg:min-h-screen bg-slate-100 p-4 font-serif border border-1 border-shrink-0 border-neutral-200 ">
        {/* basic user info */}
        <div className="flex flex-col gap-2">
          <Avatar className="w-16 h-16 lg:w-28 lg:h-28 mx-auto border-2 border-double border-purple-400 border-opacity-60 transition delay-100 duration-300 hover:border-purple-600 hover:scale-105 hover:border-4">
            <AvatarImage
              src={currentUser.profilePicture}
              className=""
              alt="..."
            />
            <AvatarFallback>Pfp</AvatarFallback>
          </Avatar>
          <p className="text-center text-xl ">
            Hello,{" "}
            <span className="text-purple-500">{currentUser.fullname}</span>!
          </p>
        </div>
        <Separator className="my-4 lg:my-8" />
        {/* different tabs */}
        <div className="flex flex-col gap-2 lg:gap-4">
          <Link to={"/dashboard?tab=profile"}>
            <Button
              variant={tab === "profile" ? "default" : "outline"}
              className="w-full gap-2 items-center"
            >
              <FaUserAlt /> Profile
            </Button>
          </Link>

          <Link to={"/dashboard?tab=posts"}>
            <Button
              variant={tab === "posts" ? "default" : "outline"}
              className="w-full gap-2 items-center"
            >
              <FaBook /> Posts
            </Button>
          </Link>

          {/* Conditionally render Admin tab if user is an admin */}
          {currentUser.isAdmin ? (
            <Link to={"/admin"}>
              <Button
                variant={location.pathname === "/admin" ? "default" : "outline"}
                className="w-full gap-2 items-center"
              >
                <FaLock /> Admin
              </Button>
            </Link>
          ) : (
            <Button
              variant={tab === "admin" ? "default" : "outline"}
              className="w-full gap-2 items-center"
              onClick={() =>
                toast.error("You need to be admin to access this page.")
              }
            >
              <FaLock /> Admin
            </Button>
          )}

          <Link to={"/dashboard?tab=setting"}>
            <Button
              variant={tab === "setting" ? "default" : "outline"}
              className="w-full gap-2 items-center"
            >
              <FaCog /> Settings
            </Button>
          </Link>
        </div>
        <Separator className="my-4 lg:my-8" />
        {/* sidebar footer */}
        <div className="flex flex-col gap-2 lg:gap-4">
          <Link to={"/dashboard?tab=support"}>
            <Button
              variant={tab === "support" ? "default" : "outline"}
              className="w-full gap-2 items-center"
            >
              <FaLifeRing /> Support
            </Button>
          </Link>

          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>Signing out ...</span>
            </>
          ) : (
            <Button
              variant="destructive"
              className="w-full gap-2 items-center"
              onClick={handleSignOut}
            >
              <FaSignOutAlt /> Signout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashSidebar;
