import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import apiRequest from "@/lib/apiRequest";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import Card2 from "./Card2";

const DashPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(
          `/post/getposts?userId=${currentUser._id}&startIndex=${
            (page - 1) * 8
          }`
        );
        setTotalPages(Math.ceil(response.data.totalPosts / 8));
        setPosts(response.data.posts);
      } catch (error) {
        toast.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, currentUser._id]);

  const handleDelete = async (postId) => {
    try {
      await apiRequest.delete(
        `post/deletepostbyid/${postId}/${currentUser._id}`
      );
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Your Posts</h1>
      <Separator className="my-4" />

      {/* Table-like layout with long vertical cards */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader color="border-purple-500" textColor="text-purple-500" />
        ) : (
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Post Image</th>
                <th className="py-3 px-4 border-b">Title</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <Card2
                  key={post._id}
                  post={post}
                  handleDelete={() => handleDelete(post._id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center items-center my-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                href="#"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={() => setPage(pageNum)}
                    isActive={pageNum === page} // Active if current page matches pageNum
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                }
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default DashPosts;
