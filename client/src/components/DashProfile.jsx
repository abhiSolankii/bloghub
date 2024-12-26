import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  FaPen,
  FaTrash,
  FaEnvelope,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "./ui/input";
import UploadWidget from "./UploadWidget";
import toast from "react-hot-toast";
import apiRequest from "@/lib/apiRequest";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const DashProfile = () => {
  const {
    currentUser,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filePickerRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState(
    currentUser.profilePicture || ""
  );
  const [showSaveButton, setShowSaveButton] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    fullname: currentUser.fullname,
    email: currentUser.email,
    profilePicture: profilePicture,
  });
  // console.log(formData);
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await apiRequest.put(
        `/user/update/${currentUser._id}`,
        formData
      );

      toast.success(res.data.message || "Profile updated");
      dispatch(updateUserSuccess(res.data.updatedUser));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to Update Profile!");
      dispatch(
        updateUserFailure(
          error.response?.data?.message || "Failed to Update Profile!"
        )
      );
    } finally {
      setShowSaveButton(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Logic for deleting account
    try {
      dispatch(deleteUserStart());
      const res = await apiRequest.delete(`/user/delete/${currentUser._id}`);
      toast.success(res.data.message);
      dispatch(deleteUserSuccess());
    } catch (error) {
      console.log("Error in deleting account: ", error);
      dispatch(
        deleteUserFailure(
          error.response?.data?.message || "Error in deleting account!"
        )
      );
      toast.error(
        error.response?.data?.message || "Error in deleting account!"
      );
    }
  };

  const handleVerifyEmail = () => {
    // Logic for email verification
    console.log("Verification email sent");
  };

  return (
    <div className="w-full p-4">
      {/* Page Header */}
      <h1 className="capitalize font-semibold font-serif text-2xl text-center mb-6 mt-6">
        My Profile
      </h1>

      {/* Avatar Section */}
      <div className="text-center mb-8 flex flex-col gap-4">
        <Avatar
          onClick={() => filePickerRef.current?.click()}
          className="cursor-pointer w-20 h-20 lg:w-32 lg:h-32 mx-auto border-2 border-double border-purple-400 border-opacity-60 transition delay-100 duration-300 hover:border-purple-600 hover:scale-105 hover:border-4"
        >
          <AvatarImage
            src={profilePicture || currentUser.profilePicture}
            alt="Profile Picture"
          />
          <AvatarFallback>{currentUser.fullname?.charAt(0)}</AvatarFallback>
        </Avatar>
        {showSaveButton && (
          <Button
            variant="outline"
            className="w-fit mx-auto px-6 bg-blue-500 hover:bg-blue-400"
            onClick={handleUpdateProfile}
          >
            Save
          </Button>
        )}
        <UploadWidget
          filePickerRef={filePickerRef}
          uwConfig={{
            cloudName: "dp2jsbp3k",
            uploadPreset: "BlogHub",
            resourceType: "image",
            clientAllowedFormats: ["jpg", "png", "jpeg"],
            multiple: false,
            maxImageFileSize: 20000000,
            folder: "avatars",
          }}
          setState={setProfilePicture}
          setUpdateForm={setFormData}
          setSaveButton={setShowSaveButton}
        />
      </div>

      {/* User Information Section */}
      <div className="border-[1px] border-slate-300 p-6 rounded-lg w-full lg:w-[60rem] mx-auto mb-6 shadow-lg bg-white">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Information</h2>
          {/* Update profile dialog  */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 items-center border-none "
              >
                <FaPen />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullname" className="text-right">
                    Fullname
                  </Label>
                  <Input
                    required
                    value={formData.fullname}
                    name="fullname"
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    value={formData.username}
                    name="username"
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    required
                    value={formData.email}
                    name="email"
                    type="email"
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <Button type="submit" onClick={handleUpdateProfile}>
                    Save changes
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Information Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="opacity-60 font-serif">Full Name</Label>
            <p className="font-semibold">{currentUser.fullname}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="opacity-60 font-serif">Username</Label>
            <p className="font-semibold">{currentUser.username}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="opacity-60 font-serif">Email</Label>
            <p className="font-semibold">{currentUser.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="opacity-60 font-serif">Verified</Label>
            <p className="font-semibold">
              {currentUser.isVerified ? (
                <span className="text-green-600 flex items-center gap-2">
                  <FaCheckCircle />
                  Yes
                </span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="opacity-60 font-serif">Admin</Label>
            <p className="font-semibold">
              {currentUser.isAdmin ? (
                <span className="text-green-600 flex items-center gap-2">
                  <FaCheckCircle />
                  Yes
                </span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="secondary"
            onClick={handleVerifyEmail}
            className="flex gap-2 items-center"
            disabled={currentUser.isVerified}
          >
            <FaEnvelope />
            {currentUser.isVerified ? "Email Verified" : "Verify Email"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex gap-2 items-center">
                <FaTrash />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-400"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* Action buttons  */}
      <div className="flex flex-col gap-2 justify-center w-full lg:w-[60rem] mx-auto">
        <Button
          className="mx-auto w-full flex gap-2 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-blue-400 transition-all duratio-300 delay-100 ease-in-out"
          variant="outline"
          onClick={() => {
            navigate("/create-post");
          }}
        >
          <span>
            <FaPlus />
          </span>
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default DashProfile;
