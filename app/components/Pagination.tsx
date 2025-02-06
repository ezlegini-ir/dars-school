"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageSize: number;
  itemCount: number;
}

const Pagination = ({ pageSize, itemCount }: Props) => {
  const pageCount = Math.ceil(itemCount / pageSize);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const changePage = (page: number) => {
    router.push(`?page=${page}`);
  };

  if (pageCount < 2) return;

  return (
    <div className="space-x-3 text-sm flex items-center">
      <button
        onClick={() => changePage(currentPage + 1)}
        className="btn btn-secondary w-28"
        disabled={currentPage === pageCount}
      >
        Next
      </button>
      <button
        onClick={() => changePage(currentPage - 1)}
        className="btn btn-secondary w-28"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="text-gray-500">
        Page {currentPage} / {pageCount} -- {itemCount} items
      </p>
    </div>
  );
};

export default Pagination;
