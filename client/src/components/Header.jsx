import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice.js";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";
import {
  FaArrowDown,
  FaEnvelope,
  FaPenAlt,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaUserAlt,
} from "react-icons/fa";

// ShadCN Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [homeBtnColor, setHomeBtnColor] = useState("text-black");
  const [aboutBtnColor, setAboutBtnColor] = useState("text-black");
  const [projectsBtnColor, setProjectsBtnColor] = useState("text-black");
  const [dashboardBtnColor, setDashboardBtnColor] = useState("text-black");

  useEffect(() => {
    setHomeBtnColor(
      location.pathname === "/" ? "text-white bg-purple-600" : "text-black"
    );
    setAboutBtnColor(
      location.pathname === "/about" ? "text-white bg-purple-600" : "text-black"
    );
    setProjectsBtnColor(
      location.pathname === "/projects"
        ? "text-white bg-purple-600"
        : "text-black"
    );
    setDashboardBtnColor(
      location.pathname === "/dashboard" || location.pathname === "/admin"
        ? "text-white bg-purple-600"
        : "text-black"
    );
  }, [location.pathname]);

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
    <nav className="bg-white border-b shadow-sm fixed top-0 w-full z-10">
      {/* Mobile View */}
      <div className="md:hidden relative p-4 flex justify-between items-center">
        <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 hover:z-10">
          <Link
            to="/"
            className="text-center flex items-center gap-2 rounded-md px-4 py-1 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 font-semibold text-slate-800 font-serif text-xl "
          >
            <FaPenAlt />
            <span>Blog Hub</span>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger>
            <Button variant="outline" className="absolute right-2 top-3 ">
              Open
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Hello User!</SheetTitle>
              <SheetDescription>Enjoy our Blog Hub.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Form>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search..." className="w-full h-9" />
                    <Link to="/search" as={"div"}>
                      <Button size="sm" type="submit">
                        Search
                      </Button>
                    </Link>
                  </div>
                </Form>
              </div>

              <Link to="/" as={"div"}>
                <SheetClose className="w-full">
                  <Button size="sm" className={`${homeBtnColor} w-full`}>
                    Home
                  </Button>
                </SheetClose>
              </Link>
              <Link to="/dashboard" as={"div"}>
                <SheetClose className="w-full">
                  <Button size="sm" className={`${dashboardBtnColor}  w-full`}>
                    Dashboard
                  </Button>
                </SheetClose>
              </Link>
              <Link to="/about" as={"div"}>
                <SheetClose className="w-full">
                  <Button size="sm" className={`${aboutBtnColor}  w-full`}>
                    About
                  </Button>
                </SheetClose>
              </Link>
              <Link to="/projects" as={"div"}>
                <SheetClose className="w-full">
                  <Button size="sm" className={`${projectsBtnColor} w-full`}>
                    Projects
                  </Button>
                </SheetClose>
              </Link>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                {/* dynamic sign in button  */}
                <div>
                  {currentUser ? (
                    <div>
                      <div className="flex justify-center items-center text-center">
                        <Button
                          variant="outline"
                          className="flex flex-row justify-center gap-2"
                          onClick={() => {
                            navigate("/dashboard?tab=profile");
                          }}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={currentUser.profilePicture}
                              alt="pfp"
                              className=""
                            />
                            <AvatarFallback>...</AvatarFallback>
                          </Avatar>
                          <span className="font-serif">Profile</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/sign-in">
                      <Button size="sm" variant="outline">
                        SignIn
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-purple-600"
        >
          <FaPenAlt />
          <span>Blog Hub</span>
        </Link>
        <div>
          <Form>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search..." className="w-full h-9" />
              <Button size="sm" type="submit">
                <FaSearch />
              </Button>
            </div>
          </Form>
        </div>

        <div className="flex gap-4">
          <Link to="/" className="text-lg">
            <Button variant="ghost" className={homeBtnColor}>
              Home
            </Button>
          </Link>
          <Link to="/about" className="text-lg">
            <Button variant="ghost" className={aboutBtnColor}>
              About
            </Button>
          </Link>
          <Link to="/projects" className="text-lg">
            <Button variant="ghost" className={projectsBtnColor}>
              Projects
            </Button>
          </Link>
          <Link to="/dashboard" className="text-lg">
            <Button variant="ghost" className={dashboardBtnColor}>
              Dashboard
            </Button>
          </Link>
        </div>

        <div>
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.profilePicture} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <p className="font-serif font-semibold ">
                    {currentUser.fullname}
                  </p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 mr-4">
                <DropdownMenuLabel>
                  Welcome, {currentUser.fullname}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=profile")}
                  >
                    <FaUserAlt />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/create-post")}>
                    <FaPlus />
                    <span>Create post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={handleSignOut}
                  >
                    <FaSignOutAlt />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
