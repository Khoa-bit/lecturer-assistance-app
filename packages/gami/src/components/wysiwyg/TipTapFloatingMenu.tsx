import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react";

interface TipTapFloatingMenuProps {
  editor: Editor;
}

export default function TipTapFloatingMenu({
  editor,
}: TipTapFloatingMenuProps) {
  return (
    <FloatingMenu tippyOptions={{ duration: 100 }} editor={editor}>
      <ul className="rounded-btn ml-5 flex h-fit overflow-hidden bg-white shadow-lg shadow-gray-400">
        <li>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`flex w-full items-center p-2 hover:bg-gray-100 ${
              editor.isActive("heading", { level: 1 })
                ? "is-active bg-gray-200"
                : ""
            }`}
          >
            <span className="font-semibold text-gray-500">H1</span>
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`flex w-full items-center p-2 hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 })
                ? "is-active bg-gray-200"
                : ""
            }`}
          >
            <span className="font-semibold text-gray-500">H2</span>
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`flex w-full items-center p-2 hover:bg-gray-100 ${
              editor.isActive("heading", { level: 3 })
                ? "is-active bg-gray-200"
                : ""
            }`}
          >
            <span className="font-semibold text-gray-500">H3</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex h-full w-full items-center justify-center p-2 px-3 hover:bg-gray-100 ${
              editor.isActive("taskList") ? "is-active bg-gray-200" : ""
            }`}
          >
            <div className="rounded-full bg-gray-500 p-1"></div>
          </button>
        </li>
        <li>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`flex h-full w-full items-center justify-center p-2 hover:bg-gray-100 ${
              editor.isActive("taskList") ? "is-active bg-gray-200" : ""
            }`}
          >
            <div className="rounded-sm border-2 border-gray-500 p-1.5"></div>
          </button>
        </li>
      </ul>
    </FloatingMenu>
  );
}
