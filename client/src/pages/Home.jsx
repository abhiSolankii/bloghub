//shadcn imports
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card1 from "@/components/Card1";

import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

const Home = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        //set start index according to the number of page so that right amount of posts can be skipped.
        const res = await apiRequest(
          `/post/getposts?startIndex=${(page - 1) * 8}`
        );
        setBlogs(res.data.posts);
        setTotalPages(Math.ceil(res.data.totalPosts / 8));
        setLoading(false);
      } catch (error) {
        console.error("Error in fetching blogs: ", error);
        toast.error(
          error.response?.data?.message || "Error in fetching blogs."
        );
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  return (
    <div className="w-full">
      <section className="flex justify-between  p-4 w-full">
        <div className="mx-auto md:mx-0  mt-10 md:mt-24 flex flex-col gap-1 my-auto ">
          <h1 className="text-4xl font-bold text-center">Welcome to</h1>
          <h1 className="text-purple-500 text-4xl font-bold text-center">
            Blog <span className="text-blue-400">Hub</span>
          </h1>
          <p className="text-lg opacity-60 mt-2 text-center w-full lg:w-[50rem]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente.
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente.
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente.
          </p>
          <Link to="/search" className="flex justify-center" as={"div"}>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-blue-400 hover:bg-purple-400 hover:text-white w-full lg:w-[80%] "
            >
              View Posts
            </Button>
          </Link>
        </div>
        <div className="hidden md:flex">
          <img
            src="https://www.shutterstock.com/image-vector/blogging-blogger-freelance-creative-writing-600nw-1165873744.jpg"
            alt="blog hub"
            className="bg-inherit mx-auto pr-24"
          />
        </div>
      </section>
      <Separator className="w-[80%] mx-auto mb-4" />
      <section className="p-4">
        <h1 className="text-center text-xl font-semibold mb-10 font-serif underline opacity-70">
          Recent Posts
        </h1>
        {loading ? (
          <div className="my-28">
            <Loader text="Loading blogs..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 mx-auto items-center flex-wrap gap-y-10 justify-center">
            {blogs.map((item, index) => (
              <div key={index} className="mx-auto">
                <Card1
                  image={item.image || "#"}
                  title={item.title || "Untitled Post"}
                  content={item.content || "No content available."}
                  category={item.category || "Uncategorized"}
                  author={item.author || "Anonymous"}
                  date={item.createdAt}
                  topic={item.category || "General"}
                />
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        <div className="w-full flex justify-center items-center my-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
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

        <div className="w-full flex justify-center items-center mt-4">
          <Button size="lg" className="bg-pink-400">
            View All Posts
          </Button>
        </div>
      </section>
      <Separator className="w-[100%] mx-auto my-10" />
    </div>
  );
};

export default Home;
