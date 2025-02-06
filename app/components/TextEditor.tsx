import React from "react";
// FROALA TEXT EDITOR
import Editor from "react-froala-wysiwyg";
// Import  Froala Editor styles;
import "froala-editor/css/froala_editor.pkgd.min.css";
// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

interface Props {
  editorContent: string;
  setEditorContent: (content: string) => void;
  register: any;
}

const TextEditor = ({ editorContent, setEditorContent, register }: Props) => {
  return (
    <Editor
      model={editorContent}
      onModelChange={(content: string) => {
        // Parse content into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        // Select all headings (h2, h3, h4)
        const headings = doc.querySelectorAll("h2, h3, h4");
        // Assign unique ID based on index
        headings.forEach((heading, index) => {
          heading.id = `heading-${index}`;
        });
        // Get updated HTML with IDs
        const updatedContent = doc.body.innerHTML;

        // Update editor content
        setEditorContent(content);
        register("content").onChange({
          target: { name: "content", value: updatedContent },
        });
      }}
      config={{
        placeholderText: false,
        heightMin: 500,
        imageUploadURL: "/api/froala-image/post",
        imageManagerLoadURL: "/api/froala-image/get",
        imageManagerDeleteURL: "/api/froala-image/delete",
        imageMaxSize: 2 * 1024 * 1024,
        imageAllowedTypes: ["jpeg", "jpg", "png", "webp"],
        imageManagerDeleteMethod: "DELETE",
      }}
      tag="textarea"
    />
  );
};

export default TextEditor;
