import useOpen from "@/hooks/useOpen";
import { Trash2 } from "lucide-react";

const DeleteModal = () => {
  const { setOpen } = useOpen();

  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-black/30 z-10 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center items-center card"
      >
        <div className="flex flex-col items-center gap-3">
          <Trash2 className="text-6xl text-center text-red-500 animate-pulse" />
          <p className="text-base">
            Are you Sure you want to delete this item?
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => {
                console.log("Deleted");
                setOpen(false);
              }}
              className="btn btn-danger flex-1"
            >
              Delete
            </button>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-secondary flex-1"
            >
              Ignore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
