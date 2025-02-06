import { useState } from "react";

const useEditorContent = (content: string | undefined) => {
  const [editorContent, setEditorContent] = useState(content || "");

  return { editorContent, setEditorContent };
};

export default useEditorContent;
