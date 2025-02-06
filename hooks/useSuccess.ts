import { useState } from "react";

const useSuccess = (defaultValue?: string) => {
  const [success, setSuccess] = useState<string>(defaultValue || "");
  return { success, setSuccess };
};

export default useSuccess;
