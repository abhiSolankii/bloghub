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

import { FiTrash2 } from "react-icons/fi";
import { FaUserAltSlash } from "react-icons/fa";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";

const CardAdminPost = ({ post, setLoadPosts }) => {
  //Funtion to delete post
  const handleDeletePost = async (postId) => {
    try {
      const response = await apiRequest.delete(
        `/admin/deletepostbyid/${postId}`
      );
      toast.success(response.data?.message || "Post deleted successfully");
      setLoadPosts((prev) => !prev);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting post");
      console.error("Error in deleting post", error);
    }
  };

  //Funtion to delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await apiRequest.delete(
        `/admin/deleteuserbyid/${userId}`
      );
      toast.success(response.data?.message || "User deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
      console.error("Error in deleting user", error);
    }
  };

  return (
    <div className="grid grid-cols-10 gap-2 items-center p-4 text-center">
      <span className="col-span-1">
        {new Date(post.createdAt).toLocaleDateString()}
      </span>
      <img
        src={post.image}
        alt={post.author}
        className="w-12 h-12 rounded-xl object-cover col-span-1 mx-auto"
      />
      <span className="col-span-3">{post.title}</span>
      <span className="col-span-1">{post.author}</span>
      <span className="col-span-1">{post.userId?.fullname || "N/A"}</span>

      <div className="col-span-3 flex justify-center gap-4 text-xl">
        {/* Delete Post button with confirmation dialog */}
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
                    Delete Post
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this post?
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
                  onClick={() => handleDeletePost(post._id)}
                >
                  Confirm
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete user button with confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button className="text-yellow-400 hover:text-yellow-600 flex items-center">
                      <FaUserAltSlash className="mr-1" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-yellow-600">
                    Delete User Account
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
                  onClick={() => handleDeleteUser(post.userId._id)}
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

export default CardAdminPost;
