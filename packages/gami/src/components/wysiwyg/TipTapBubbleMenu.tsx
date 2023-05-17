import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import { IcRoundFormatBold } from "../icons/Wysiwyg/IcRoundFormatBold";
import { IcRoundFormatItalic } from "../icons/Wysiwyg/IcRoundFormatItalic";
import { IcRoundStrikethroughS } from "../icons/Wysiwyg/IcRoundStrikethroughS";
import { IcRoundAlignHorizontalLeft } from "../icons/Wysiwyg/IcRoundAlignHorizontalLeft";
import { IcRoundAlignHorizontalCenter } from "../icons/Wysiwyg/IcRoundAlignHorizontalCenter";
import { IcRoundAlignHorizontalRight } from "../icons/Wysiwyg/IcRoundAlignHorizontalRight";
import { IcRoundFormatAlignJustify } from "../icons/Wysiwyg/IcRoundFormatAlignJustify";
import { IcRoundAddLink } from "../icons/Wysiwyg/IcRoundAddLink";
import { IcRoundLinkOff } from "../icons/Wysiwyg/IcRoundLinkOff";
import type {
  GetCommentFunctionsRetuns,
  UseCommentStateReturns,
} from "./tiptapCommentExtension/commentHooks";
import { IcRoundArrowDropDown } from "../icons/IcRoundArrowDropDown";
import { IcRoundFormatSize } from "../icons/Wysiwyg/IcRoundFormatSize";
import { IcRoundFormatIndentIncrease } from "../icons/Wysiwyg/IcRoundFormatIndentIncrease";
import { IcRoundFormatIndentDecrease } from "../icons/Wysiwyg/IcRoundFormatIndentDecrease";
import { IcRoundColorLens } from "../icons/Wysiwyg/IcRoundColorLens";
import { IcRoundComment } from "../icons/Wysiwyg/IcRoundComment";
import { ParticipantsPermissionOptions } from "raito";

interface TipTapBubbleMenuProps {
  editor: Editor;
  setLink: () => void;
  username: string;
  permission: ParticipantsPermissionOptions;
  commentState: UseCommentStateReturns;
  commentFunctions: GetCommentFunctionsRetuns;
}

export default function TipTapBubbleMenu({
  editor,
  setLink,
  username,
  permission,
  commentState,
  commentFunctions,
}: TipTapBubbleMenuProps) {
  const {
    commentText,
    setCommentText,
    isTextSelected,
    setIsTextSelected,
    activeCommentDialog,
    setActiveCommentDialog,
    allCommentSpans,
    setAllCommentSpans,
  } = commentState;

  const {
    findAllCommentSpans,
    getActiveCommentDialog,
    setComment,
    toggleComment,
    unsetComment,
  } = commentFunctions;

  return (
    <BubbleMenu
      className="rounded-btn flex w-max border bg-white shadow-lg shadow-gray-400"
      tippyOptions={{ duration: 100, hideOnClick: true }}
      editor={editor}
    >
      {permission === ParticipantsPermissionOptions.write && (
        <>
          <div className="dropdown-end dropdown hover:bg-gray-100">
            <label
              tabIndex={0}
              className="flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <IcRoundFormatSize className="h-7 w-7 p-1"></IcRoundFormatSize>
              <IcRoundArrowDropDown></IcRoundArrowDropDown>
            </label>
            <ul className="dropdown-content rounded-btn mt-1 flex h-fit flex-col overflow-hidden bg-white shadow-lg shadow-gray-400">
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
                  <span>Heading 1</span>
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
                  <span>Heading 2</span>
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
                  <span>Heading 3</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={`flex w-full items-center p-2 hover:bg-gray-100 ${
                    editor.isActive("paragraph") ? "is-active bg-gray-200" : ""
                  }`}
                >
                  <span>Paragraph</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`flex w-full items-center p-2 hover:bg-gray-100 ${
                    editor.isActive("taskList") ? "is-active bg-gray-200" : ""
                  }`}
                >
                  <span>Bullet list</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  className={`flex w-full items-center p-2 hover:bg-gray-100 ${
                    editor.isActive("taskList") ? "is-active bg-gray-200" : ""
                  }`}
                >
                  <span>Check list</span>
                </button>
              </li>
              <li>
                <button
                  disabled={!editor.can().sinkListItem("taskItem")}
                  onClick={() =>
                    editor.chain().focus().sinkListItem("taskItem").run()
                  }
                  className={`flex w-full items-center p-2 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("taskList") ? "is-active bg-gray-200" : ""
                  }`}
                >
                  <IcRoundFormatIndentDecrease className="h-7 w-7 p-1"></IcRoundFormatIndentDecrease>{" "}
                  List
                </button>
              </li>
              <li>
                <button
                  disabled={!editor.can().liftListItem("taskItem")}
                  onClick={() =>
                    editor.chain().focus().liftListItem("taskItem").run()
                  }
                  className={`flex w-full items-center p-2 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("taskList") ? "is-active bg-gray-200" : ""
                  }`}
                >
                  <IcRoundFormatIndentIncrease className="h-7 w-7 p-1"></IcRoundFormatIndentIncrease>{" "}
                  List
                </button>
              </li>
            </ul>
          </div>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
              editor.isActive("bold") ? "is-active bg-gray-200" : ""
            }`}
            title="Bold"
          >
            <IcRoundFormatBold className="h-7 w-7 p-1"></IcRoundFormatBold>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
              editor.isActive("italic") ? "is-active bg-gray-200" : ""
            }`}
            title="Italic"
          >
            <IcRoundFormatItalic className="h-7 w-7 p-1"></IcRoundFormatItalic>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
              editor.isActive("strike") ? "is-active bg-gray-200" : ""
            }`}
            title="Strike through"
          >
            <IcRoundStrikethroughS className="h-7 w-7 p-1"></IcRoundStrikethroughS>
          </button>
          <div className="dropdown-end dropdown hover:bg-gray-100">
            <label
              tabIndex={0}
              className="flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <CurrentAlignment editor={editor}></CurrentAlignment>
              <IcRoundArrowDropDown></IcRoundArrowDropDown>
            </label>
            <ul className="dropdown-content rounded-btn !-right-12 mt-1 flex h-fit overflow-hidden bg-white shadow-lg shadow-gray-400">
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive({ textAlign: "left" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                  title="Align left"
                >
                  <IcRoundAlignHorizontalLeft className="h-7 w-7 p-1"></IcRoundAlignHorizontalLeft>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive({ textAlign: "center" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                  title="Align center"
                >
                  <IcRoundAlignHorizontalCenter className="h-7 w-7 p-1"></IcRoundAlignHorizontalCenter>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive({ textAlign: "right" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                  title="Align right"
                >
                  <IcRoundAlignHorizontalRight className="h-7 w-7 p-1"></IcRoundAlignHorizontalRight>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive({ textAlign: "justify" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                  title="Align justify"
                >
                  <IcRoundFormatAlignJustify className="h-7 w-7 p-1"></IcRoundFormatAlignJustify>
                </button>
              </li>
            </ul>
          </div>
          <div className="dropdown-end dropdown hover:bg-gray-100">
            <label
              tabIndex={0}
              className="flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <IcRoundColorLens className="h-7 w-7 p-1"></IcRoundColorLens>
              <IcRoundArrowDropDown></IcRoundArrowDropDown>
            </label>
            <ul className="dropdown-content rounded-btn -top-60 flex h-fit flex-col overflow-hidden bg-white shadow-lg shadow-gray-400">
              <li className="p-1 text-xs text-gray-500">COLOR</li>
              <li>
                <button
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold">
                    A
                  </div>
                  <span>Default</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#a855f7").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#a855f7" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-purple-500">
                    A
                  </div>
                  <span>Purple</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#f43f5e").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#f43f5e" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-red-500">
                    A
                  </div>
                  <span>Red</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#f97316").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#f97316" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-orange-500">
                    A
                  </div>
                  <span>Orange</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#eab308").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#eab308" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-yellow-500">
                    A
                  </div>
                  <span>Yellow</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#3b82f6").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#3b82f6" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-blue-500">
                    A
                  </div>
                  <span>Blue</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#14b8a6").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#14b8a6" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-teal-500">
                    A
                  </div>
                  <span>Teal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor("#22c55e").run()
                  }
                  className={`flex w-full items-center gap-1 p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("textStyle", { color: "#22c55e" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold text-green-500">
                    A
                  </div>
                  <span>Green</span>
                </button>
              </li>
              <li className="p-1 text-xs text-gray-500">BACKGROUND</li>
              <li>
                <button
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  <div className="rounded-btn h-7 w-7 border font-semibold">
                    A
                  </div>
                  <span>Default Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#f3e8ff" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#f3e8ff" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-purple-200 bg-purple-100 font-semibold">
                    A
                  </div>
                  <span>Purple Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#ffe4e6" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#ffe4e6" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-red-200 bg-red-100 font-semibold">
                    A
                  </div>
                  <span>Red Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#ffedd5" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#ffedd5" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-orange-200 bg-orange-100 font-semibold">
                    A
                  </div>
                  <span>Orange Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#fef9c3" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#fef9c3" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-yellow-200 bg-yellow-100 font-semibold">
                    A
                  </div>
                  <span>Yellow Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#dbeafe" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#dbeafe" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-blue-200 bg-blue-100 font-semibold">
                    A
                  </div>
                  <span>Blue Background</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#ccfbf1" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#ccfbf1" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-teal-200 bg-teal-100 font-semibold">
                    A
                  </div>
                  <span>Teal Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: "#dcfce7" })
                      .run()
                  }
                  className={`flex w-full items-center gap-1 whitespace-nowrap p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
                    editor.isActive("highlight", { color: "#dcfce7" })
                      ? "is-active bg-gray-200"
                      : ""
                  }`}
                >
                  <div className="rounded-btn h-7 w-7 border border-green-200 bg-green-100 font-semibold">
                    A
                  </div>
                  <span>Green Background</span>
                </button>
              </li>
            </ul>
          </div>
          <button
            onClick={setLink}
            className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 ${
              editor.isActive("link") ? "is-active bg-gray-200" : ""
            }`}
            title="Add link"
          >
            <IcRoundAddLink className="h-7 w-7 p-1"></IcRoundAddLink>
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className={`flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400`}
            disabled={!editor.isActive("link")}
            title="Link off"
          >
            <IcRoundLinkOff className="h-7 w-7 p-1"></IcRoundLinkOff>
          </button>
        </>
      )}
      {permission !== ParticipantsPermissionOptions.read && (
        <div className="dropdown-end dropdown hover:bg-gray-100">
          <label
            tabIndex={0}
            className="flex w-full items-center p-1.5 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <IcRoundComment className="h-7 w-7 p-1"></IcRoundComment>
            <IcRoundArrowDropDown></IcRoundArrowDropDown>
          </label>
          <ul className="dropdown-content rounded-btn mt-1 flex h-fit flex-col overflow-hidden bg-white shadow-lg shadow-gray-400">
            <li className="bg-white p-2 shadow-lg shadow-gray-400">
              <textarea
                value={commentText}
                onInput={(e) => setCommentText(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    setComment(
                      editor,
                      commentText,
                      allCommentSpans,
                      activeCommentDialog,
                      username
                    );
                    setCommentText("");
                  }
                }}
                cols={30}
                rows={4}
                placeholder="Add comment..."
                className="textarea-bordered textarea mb-2"
              />

              <section className="flex w-full flex-row gap-1.5">
                <button
                  className="w-1/4 rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700 transition-colors hover:border-transparent hover:bg-slate-500 hover:text-slate-50"
                  onClick={() => setCommentText("")}
                >
                  Clear
                </button>

                <button
                  className="w-1/4 rounded bg-yellow-100 px-2 py-1 font-semibold text-yellow-700 transition-colors hover:border-transparent hover:bg-yellow-500 hover:text-yellow-50"
                  onClick={() => toggleComment(editor)}
                >
                  Toggle
                </button>

                <button
                  className="w-2/4 rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700 transition-colors hover:border-transparent hover:bg-blue-500 hover:text-blue-50"
                  onClick={() => {
                    setComment(
                      editor,
                      commentText,
                      allCommentSpans,
                      activeCommentDialog,
                      username
                    );
                    setCommentText("");
                  }}
                >
                  Add
                </button>
              </section>
            </li>
          </ul>
        </div>
      )}
    </BubbleMenu>
  );
}

function CurrentAlignment({ editor }: { editor: Editor }) {
  if (editor.isActive({ textAlign: "left" })) {
    return (
      <IcRoundAlignHorizontalLeft className="h-7 w-7 p-1"></IcRoundAlignHorizontalLeft>
    );
  }
  if (editor.isActive({ textAlign: "center" })) {
    return (
      <IcRoundAlignHorizontalCenter className="h-7 w-7 p-1"></IcRoundAlignHorizontalCenter>
    );
  }
  if (editor.isActive({ textAlign: "right" })) {
    return (
      <IcRoundAlignHorizontalRight className="h-7 w-7 p-1"></IcRoundAlignHorizontalRight>
    );
  }
  if (editor.isActive({ textAlign: "justify" })) {
    return (
      <IcRoundFormatAlignJustify className="h-7 w-7 p-1"></IcRoundFormatAlignJustify>
    );
  }
  return <p>AL</p>;
}
