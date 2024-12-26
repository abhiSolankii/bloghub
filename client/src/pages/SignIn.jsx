import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
//redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

//components
import OAuth from "@/components/OAuth.jsx";

//shadcn imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiRequest from "@/lib/apiRequest";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  //inputs

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the event
    switch (name) {
      case "username":
        setUsername(value.trim());
        break;
      case "password":
        setPassword(value.trim());
        break;
      default:
        break;
    }
  };

  //show or hide password
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    SetIsPasswordVisible((prev) => !prev);
  };

  //submit form
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData({
      username,
      password,
    });
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await apiRequest.post("/auth/signin", formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message);
      // console.log(res.data.user);
      dispatch(signInSuccess(res.data.user));
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to signin!");
      dispatch(
        signInFailure(error.response?.data?.message || "Failed to signin!")
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 items-center w-full lg:pt-10">
      <div className="bg-white w-full lg:h-[35rem] lg:w-[60rem] mx-auto lg:flex justify-center rounded-md">
        {/* left side  */}
        <div className="w-full lg:w-[50%] h-full p-10">
          <h1 className="text-xl font-semibold font-serif">Hello!</h1>
          <p className="font-serif opacity-70">Please signup to continue</p>
          <form className="mt-8 flex flex-col gap-3" onSubmit={handleSubmit}>
            <Label className="font-semibold text-lg">Username</Label>
            <Input
              onChange={handleInputChange}
              placeholder="johndoe321"
              type="text"
              name="username"
              value={username}
              required
            ></Input>

            <Label className="font-semibold text-lg">Password</Label>
            <div className="flex flex-row items-center justify-between">
              <Input
                onChange={handleInputChange}
                placeholder="Password"
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={password}
                required
                className="w-[90%]"
              ></Input>
              <Button
                className="bg-slate-600"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {isPasswordVisible ? (
                  <FaEyeSlash className="text-2xl" />
                ) : (
                  <FaEye className="text-2xl" />
                )}
              </Button>
            </div>

            <Button type="submit" className="bg-purple-500" disabled={loading}>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <p>Sign In</p>
              )}
            </Button>
          </form>

          <div className="text-md opacity-70 text-center mt-4 items-center flex flex-col gap-4">
            <div>
              <p>or</p>
              <p className="font-serif">Signin with</p>
            </div>

            <OAuth />
            <p>
              Do not have an account?{" "}
              <Link
                to={"/sign-up"}
                className="font-semibold text-blue-500 cursor-pointer hover:text-blue-400"
                aria-label="Signup for a new account"
              >
                SignUp
              </Link>
            </p>
          </div>
        </div>
        {/* right side  */}
        <div className="hidden w-[50%] bg-purple-200 h-full items-center lg:flex flex-col justify-center ">
          <Link
            as={"div"}
            to="/"
            className="text-center rounded-md px-4 py-1 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 font-semibold text-slate-800 font-serif text-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:from-pink-400 hover:via-blue-400 hover:to-purple-400 duration-300"
          >
            Blog Hub
          </Link>
          <div className="mt-4 space-y-2 text-center">
            <p className="text-lg font-medium text-gray-800">
              Join our community today and unlock exclusive benefits.
            </p>
            <p className="text-lg text-gray-600">
              Discover insightful articles from thought leaders.
            </p>

            <p className="text-lg text-gray-600">
              Engage, learn, and grow with us!
            </p>
          </div>
        </div>
      </div>
      <Separator className="w-[100%] mx-auto my-10" />
    </div>
  );
};

export default SignIn;
