import { useState } from "react";

const useError = (defaultValue?: string) => {
  const [error, setError] = useState<string>(defaultValue || "");
  return { error, setError };
};

export default useError;
