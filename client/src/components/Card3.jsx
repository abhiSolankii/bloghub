import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FiAlertCircle, FiLock, FiTrash2, FiUnlock } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";

const Card3 = ({ user, setLoadUsers }) => {
  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await apiRequest.delete(`/admin/deleteuserbyid/${userId}`);
      toast.success("User deleted successfully!");
      setLoadUsers((prev) => !prev);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  // Function to handle user admin status change
  const handleMakeOrRemoveAdmin = async (userId) => {
    try {
      const response = await apiRequest.post(`/admin/makeadminbyid/${userId}`);
      toast.success("Admin status changed successfully!");
      setLoadUsers((prev) => !prev);
    } catch (error) {
      console.error("Error changing admin status:", error);
      toast.error(
        error.response?.data?.message || "Error changing admin status"
      );
    }
  };

  return (
    <div className=" mx-auto grid grid-cols-10 gap-2 items-center p-4 text-center">
      <span className="col-span-1">
        {new Date(user.createdAt).toLocaleDateString()}
      </span>
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover col-span-1 mx-auto"
      />
      <span className="col-span-1">{user.username}</span>
      <span className="col-span-4">{user.email}</span>
      <span className="col-span-1 flex justify-center">
        {user.isAdmin ? (
          <FaCheck className="text-green-600 text-xl" />
        ) : (
          <FaTimes className="text-red-600 text-xl" />
        )}
      </span>
      <div className="col-span-2 flex justify-center gap-4 text-xl">
        {/* Make/Remove admin button  */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button
                className="text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleMakeOrRemoveAdmin(user._id)}
              >
                {user.isAdmin ? <FiUnlock /> : <FiLock />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-blue-600">
              {user.isAdmin ? "Remove Admin" : "Make Admin"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Warning button  */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button className="text-yellow-400 hover:text-yellow-300 flex items-center">
                <FiAlertCircle className="mr-1" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-yellow-400">
              Send Warning
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Delete button with confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button className="text-red-600 hover:text-red-800 flex items-center">
                      <FiTrash2 className="mr-1" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-red-600">
                    Delete User
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this user?
            </div>
            <p className="mt-2 text-gray-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <AlertDialogCancel asChild>
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">
                  Cancel
                </button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Confirm
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Card3;
