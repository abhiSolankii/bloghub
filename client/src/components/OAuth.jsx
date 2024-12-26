import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase.js";
import apiRequest from "@/lib/apiRequest";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import toast from "react-hot-toast";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
      const res = await apiRequest.post(
        "/auth/google",
        {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      dispatch(signInSuccess(res.data.user));
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error in signing in with google: ", error);
    }
  };
  return (
    <div>
      <Button
        className="bg-inherit hover:bg-inherit"
        onClick={handleGoogleClick}
      >
        <FaGoogle className="text-3xl text-blue-600 hover:text-blue-500 transition ease-in-out duration-300 delay-150 hover:translate-y-1 hover:scale-110 cursor-pointer " />
      </Button>
    </div>
  );
};

export default OAuth;
