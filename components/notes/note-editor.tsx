"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Code, Quote, Highlighter,
  Heading1, Heading2, Heading3, Link as LinkIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect } from "react";

interface NoteEditorProps {
  content?: string;
  onChange?: (json: string, text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function NoteEditor({
  content,
  onChange,
  placeholder = "Start writing your note...",
  editable = true,
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Highlight,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: content ? JSON.parse(content) : "",
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(
          JSON.stringify(editor.getJSON()),
          editor.getText()
        );
      }
    },
  });

  useEffect(() => {
    if (editor && content) {
      try {
        const parsed = JSON.parse(content);
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(parsed)) {
          editor.commands.setContent(parsed);
        }
      } catch {}
    }
  }, [content, editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={clsx(
        "p-1.5 rounded-md transition-colors",
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {editable && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50 flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </ToolbarButton>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={14} />
          </ToolbarButton>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered size={14} />
          </ToolbarButton>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            <Code size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter size={14} />
          </ToolbarButton>
        </div>
      )}

      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}