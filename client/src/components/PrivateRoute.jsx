import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { currentUser, updateUser } = useSelector((state) => state.user);

  useEffect(() => {
    const token = Cookies.get("access_token"); // Get token from cookies

    if (!token || !currentUser) {
      // If no token or user is not logged in, clear token and state
      Cookies.remove("access_token");
      dispatch(updateUserStart());
      dispatch(updateUserSuccess(null));
      toast.error("Please log in to access this page.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        Cookies.remove("access_token"); // Remove expired token
        dispatch(updateUser(null)); // Clear user state
        toast.error("Session expired, please log in again.");
      }
    } catch (error) {
      // Handle invalid token case
      Cookies.remove("access_token");
      dispatch(updateUser(null));
      toast.error("Invalid token, please log in again.");
    }
  }, [currentUser, dispatch]);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
