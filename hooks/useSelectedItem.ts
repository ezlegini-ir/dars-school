// hooks/useSelectedItem.ts
import { useState } from "react";

const useSelectedItem = <T>() => {
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);

  return { selectedItem, setSelectedItem };
};

export default useSelectedItem;
