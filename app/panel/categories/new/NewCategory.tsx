"use client";

import useOpen from "@/hooks/useOpen";

const NewCategory = () => {
  const { setOpen } = useOpen();

  return (
    <div>
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        New Category
      </button>
    </div>
  );
};

export default NewCategory;
