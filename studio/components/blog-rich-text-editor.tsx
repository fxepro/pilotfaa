"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
// Using react-quill-new for React 19 compatibility
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogRichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog post content here...",
}: BlogRichTextEditorProps) {
  // Define the toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      clipboard: {
        // Toggle to add line breaks when pasting
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "color",
    "background",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          minHeight: "400px",
          marginBottom: "42px", // Space for toolbar
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 1rem;
          line-height: 1.6;
          min-height: 400px;
        }
        .rich-text-editor .ql-editor {
          min-height: 400px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        .rich-text-editor .ql-editor {
          padding: 1rem;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}
