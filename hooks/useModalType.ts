import { useState } from "react";

const useModalType = () => {
  const [modalType, setModalType] = useState<
    "CREATE" | "UPDATE" | "DELETE" | null
  >(null);

  return { modalType, setModalType };
};

export default useModalType;
