import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { deleteBlog } from "../redux/blog/blogSlice"; // Make sure to implement this action in your blogSlice

const ReadBlog = ({ blog }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    // Confirm deletion before proceeding
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(blog.id)); // Replace with the actual id field
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600 mb-2">Category: {blog.category}</p>
      <img
        src={blog.image}
        alt={blog.title}
        className="mb-4 w-full h-64 object-cover rounded-lg"
      />
      <div className="mb-4">
        <p className="text-gray-500">By {blog.author}</p>
        <p className="text-gray-500">
          Created At: {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mb-4">
        <p>{blog.content}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Link to={`/update/${blog.id}`}>
          <Button variant="primary">Update</Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ReadBlog;
