import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { updateUserStart, updateUserSuccess } from "../redux/user/userSlice";

const AdminPrivateRoute = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

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
        dispatch(updateUserSuccess(null)); // Clear user state
        toast.error("Session expired, please log in again.");
      } else if (!currentUser.isAdmin) {
        // If the user is not an admin
        toast.error("Access denied! Admins only.");
      }
    } catch (error) {
      // Handle invalid token case
      Cookies.remove("access_token");
      dispatch(updateUserSuccess(null));
      toast.error("Invalid token, please log in again.");
    }
  }, [currentUser, dispatch]);

  return currentUser && currentUser.isAdmin ? <Outlet /> : null; // Stay on the same page if not admin
};

export default AdminPrivateRoute;
