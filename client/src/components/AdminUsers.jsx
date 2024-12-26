import React, { useEffect, useState } from "react";
import Card3 from "./Card3";
import apiRequest from "@/lib/apiRequest";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadUsers, setLoadUsers] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users from an API
  useEffect(() => {
    const fetchUsers = async () => {
      const limit = 7;
      const sortDirection = "asc";
      try {
        const response = await apiRequest.get(
          `/user/getusers?startIndex=${
            (page - 1) * 7
          }&limit=${limit}&sort=${sortDirection}`
        );
        setUsers(response.data.users);
        setTotalPages(Math.ceil(response.data.totalPosts / 7));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [loadUsers, page]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard - Users
      </h1>
      <div className="bg-white shadow rounded-lg overflow-x-scroll">
        <div className="p-4 bg-gray-100 font-semibold text-gray-600 grid grid-cols-10 gap-4 text-center">
          <span className="col-span-1">Date created</span>
          <span className="col-span-1">User Image</span>
          <span className="col-span-1">Username</span>
          <span className="col-span-4">Email</span>
          <span className="col-span-1">Admin</span>
          <span className="col-span-2">Actions</span>
        </div>

        <div className="w-full  divide-y divide-gray-200">
          {users.map((user) => (
            <Card3 key={user._id} user={user} setLoadUsers={setLoadUsers} />
          ))}
        </div>
      </div>
      {/* Pagination */}
      {users.length < 7 ? (
        ""
      ) : (
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
      )}
    </div>
  );
};

export default AdminUsers;
