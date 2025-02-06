import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  pages: {
    id: number;
    title: string;
    content: string;
    url: string;
  }[];
  pagesCount: number;
}

const PagesList = ({ pages, pagesCount }: Props) => {
  const pageSize = 10;

  const renderRows = (page: { id: number; title: string; url: string }) => {
    return (
      <tr
        className="border-b border-gray-200 even:bg-slate-50  text-sm hover:bg-blue-50"
        key={page.id}
      >
        <td className="p-3 font-bold">
          <Link href={page.url}>{page.title}</Link>
        </td>

        <td className="flex gap-2 justify-end p-3">
          <Link href={`/panel/pages/edit/${page.id}`}>
            <div className="h-8 w-8 btn-icon relative">
              <Pencil
                size={18}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="mb-0">Pages</h3>
        <Link href={`/panel/pages/new`} className="btn btn-primary">
          New Page
        </Link>
      </div>
      <Table columns={columns} data={pages} renderRows={renderRows} />
      <Pagination pageSize={pageSize} itemCount={pagesCount} />
    </div>
  );
};

const columns = [
  { key: "title", label: "Page Title", className: "w-5/6" },
  { key: "action", label: "action", className: "w-1/6 text-right" },
];

export default PagesList;
