"use client";

import CategoryForm from "@/app/components/forms/CategoryForm";
import Modal from "@/app/components/Modal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import Toast from "@/app/components/Toast";
import useModalType from "@/hooks/useModalType";
import useSelectedItem from "@/hooks/useSelectedItem";
import useSuccess from "@/hooks/useSuccess";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  categories: ({
    _count: {
      posts: number;
    };
  } & Category)[];
  categoriesCount: number;
}

type Category = {
  id: number;
  name: string;
};

const CategoriesList = ({ categories, categoriesCount }: Props) => {
  const pageSize = 10;

  // HOOKS
  const { modalType, setModalType } = useModalType();
  const { selectedItem, setSelectedItem } = useSelectedItem<Category>();
  const { success, setSuccess } = useSuccess();

  const columns = [
    { key: "category", label: "category", className: "w-2/3" },
    {
      key: "postCOunt",
      label: "Post Count",
      className: "w-1/3 hidden sm:table-cell ",
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-1/3 text-right",
    },
  ];

  const renderRows = (category: {
    id: number;
    name: string;
    _count: { posts: number };
  }) => {
    return (
      <tr
        className="border-b border-gray-200 even:bg-slate-50  text-sm hover:bg-blue-50"
        key={category.id}
      >
        <td className="p-3">{category.name}</td>
        <td className="p-3 hidden sm:table-cell">{category._count.posts}</td>

        <td className="flex gap-2 justify-end p-3">
          <button
            onClick={() => {
              setModalType("UPDATE");
              setSelectedItem(category);
            }}
          >
            <div className="h-8 w-8 btn-icon relative">
              <Pencil
                size={18}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </button>

          <button
            onClick={() => {
              setModalType("DELETE");
              setSelectedItem(category);
            }}
          >
            <div className="h-8 w-8 btn-icon relative">
              <Trash2
                size={18}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </button>
        </td>
      </tr>
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(undefined);
  };

  console.log(selectedItem);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="mb-0">Posts</h3>
        <button
          onClick={() => {
            setModalType("CREATE");
          }}
          className="btn btn-primary"
        >
          Create
        </button>

        {modalType === "CREATE" && (
          <Modal
            type="CREATE"
            data={
              <CategoryForm
                type="CREATE"
                setOpen={closeModal}
                setSuccess={setSuccess}
              />
            }
            setOpen={closeModal}
          />
        )}

        {modalType === "UPDATE" && (
          <Modal
            type="UPDATE"
            id={selectedItem?.id}
            data={
              <CategoryForm
                type="UPDATE"
                data={selectedItem}
                setOpen={closeModal}
                setSuccess={setSuccess}
              />
            }
            setOpen={closeModal}
          />
        )}

        {modalType === "DELETE" && (
          <Modal id={selectedItem?.id} type="DELETE" setOpen={closeModal} />
        )}
      </div>
      {success && <Toast message={success} type="SUCCESS" />}

      <Table columns={columns} data={categories} renderRows={renderRows} />
      <Pagination pageSize={pageSize} itemCount={categoriesCount} />
    </div>
  );
};

export default CategoriesList;
