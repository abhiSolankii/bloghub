import React, { useEffect, useState } from "react";

import apiRequest from "@/lib/apiRequest";
import CardAdminPost from "./CardAdminPost";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loadPosts, setLoadPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts from an API
  useEffect(() => {
    const fetchPosts = async () => {
      const limit = 7;
      const sortDirection = "asc";
      try {
        const response = await apiRequest.get(
          `/post/getposts?startIndex=${
            (page - 1) * 7
          }&limit=${limit}&sort=${sortDirection}`
        );

        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.totalPosts / 7));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [loadPosts, page]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard - Posts
      </h1>
      <div className="bg-white shadow rounded-lg overflow-x-scroll">
        <div className="p-4 bg-gray-100 font-semibold text-gray-600 grid grid-cols-10 gap-4 text-center">
          <span className="col-span-1">Date created</span>
          <span className="col-span-1">Post Image</span>
          <span className="col-span-3">Title</span>
          <span className="col-span-1">Author</span>
          <span className="col-span-1">User</span>
          <span className="col-span-3">Actions</span>
        </div>

        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <CardAdminPost
              key={post._id}
              post={post}
              setLoadPosts={setLoadPosts}
            />
          ))}
        </div>
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

export default AdminPosts;
