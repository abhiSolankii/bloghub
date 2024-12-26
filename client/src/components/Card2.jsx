import React from "react";
import { Button } from "@/components/ui/button";
import formatDateAndTime from "./helpers/formatDateAndTime";
import getCategoryName from "./helpers/getCategoryName";

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
import { useNavigate } from "react-router-dom";

const Card2 = ({ post, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <tr className="hover:bg-gray-50 transition-all duration-300">
      <td className="py-4 px-4 border-b w-32">
        {formatDateAndTime(post.createdAt)}
      </td>
      <td className="py-4 px-4 border-b">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
      </td>
      <td className="py-4 px-4 border-b">
        <h2 className="text-lg font-semibold">{post.title}</h2>
      </td>
      <td className="py-4 px-4 border-b">{getCategoryName(post.category)}</td>
      <td className="py-4 px-4 border-b flex space-x-2 ">
        <Button className="text-white bg-blue-500 hover:bg-blue-400">
          Read More
        </Button>
        <Button
          onClick={() => navigate(`/update-post/${post._id}`)}
          className="text-white bg-green-500 hover:bg-green-400"
        >
          Update
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="destructive"
              className="text-white bg-red-500 hover:bg-red-400"
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDelete(post._id);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};

export default Card2;
