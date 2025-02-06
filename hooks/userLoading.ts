import { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState<"ACTION" | "DELETE" | "">("");
  return { loading, setLoading };
};

export default useLoading;
