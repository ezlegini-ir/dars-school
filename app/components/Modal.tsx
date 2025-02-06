"use client";

import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX } from "react";

interface Props {
  type: "CREATE" | "DELETE" | "UPDATE";
  data?: JSX.Element;
  setOpen: (value: boolean) => void;
  id?: number;
}

const Modal = ({ type, data, setOpen, id }: Props) => {
  const router = useRouter();

  const DeleteModal = () => {
    return (
      <div className="flex flex-col items-center gap-5 max-w-sm mx-auto">
        <Trash2 size={75} className="text-center text-red-500 animate-pulse" />
        <p className="text-base">Are you Sure you want to delete this item?</p>

        <button
          onClick={async () => {
            try {
              await axios.delete(`/api/categories/${id}`);
              setOpen(false);
              router.refresh();
            } catch (error) {
              console.log(error);
            }
          }}
          className="btn btn-danger p-3 w-full flex-1"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        onMouseUp={(e) => e.stopPropagation()}
        onMouseDown={() => setOpen(false)}
        className="fixed inset-0 bg-slate-950/15 z-10  flex justify-center items-center"
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className={`space-y-3 w-[95%] sm:w-[75%] md:w-[60%] lg:w-[50] xl:w-[25%] max-w-[400px] p-7 card`}
        >
          {type === "DELETE" ? <DeleteModal /> : data}
          <div className="max-w-sm mx-auto">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-secondary p-3 w-full flex-1"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
