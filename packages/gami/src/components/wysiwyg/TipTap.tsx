import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type PocketBase from "pocketbase";
import type { AttachmentsResponse, UsersResponse } from "raito";
import type { Dispatch, SetStateAction } from "react";
import { formatDate } from "src/lib/input_handling";
import SuperJSON from "superjson";
import CustomImage from "./customImageExtension/image";
import useImage from "./customImageExtension/imageHooks";
import suggestion from "./suggestion";
import { Comment } from "./tiptapCommentExtension/comment";
import { useComment } from "./tiptapCommentExtension/commentHooks";

interface TipTapProps {
  name: string;
  onChange: (...event: unknown[]) => void;
  value?: { json: object };
  documentId: string;
  pbClient: PocketBase;
  user: UsersResponse | undefined;
  setCurAttachments: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>;
}

const dateTimeFormat = "dd-MM-yyyy HH:mm";

const Tiptap = ({
  name,
  onChange,
  value,
  documentId,
  pbClient,
  user,
  setCurAttachments,
}: TipTapProps) => {
  const { imageProxy, imageHandleDrop, addImage } = useImage(
    pbClient,
    documentId,
    setCurAttachments
  );

  const editor = useEditor({
    onCreate: ({ editor }) => {
      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()), name },
      });
    },

    onUpdate: ({ editor }) => {
      findCommentsAndStoreValues();

      setCurrentComment(editor);

      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()), name },
      });
    },

    onSelectionUpdate({ editor }) {
      setCurrentComment(editor);

      setIsTextSelected(!!editor.state.selection.content().size);
    },

    editorProps: {
      attributes: {
        class: "prose",
      },
      handleDrop: function (view, event, slice, moved) {
        return imageHandleDrop(view, event, moved);
      },
    },

    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Link,
      TextStyle,
      Color,
      Typography,
      CustomImage.configure({ imageProxy }),
      TaskList.configure({
        HTMLAttributes: {
          class: "pl-0",
        },
      }),
      TaskItem.configure({
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
      }),
      Comment,
    ],
    content: value?.json,
  });

  const {
    // isCommentModeOn,
    // setIsCommentModeOn,
    // currentUserName,
    // setCurrentUserName,
    commentText,
    setCommentText,
    // showCommentMenu,
    // setShowCommentMenu,
    // isTextSelected,
    setIsTextSelected,
    // showAddCommentSection,
    // setShowAddCommentSection,
    activeCommentsInstance,
    // setActiveCommentsInstance,
    allComments,
    // setAllComments,
    findCommentsAndStoreValues,
    setCurrentComment,
    setComment,
    // toggleCommentMode,
    toggleComment,
    unsetComment,
  } = useComment(editor, user?.username ?? "Anonymous");

  if (!editor) {
    return <></>;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div>
      {editor && (
        <BubbleMenu tippyOptions={{ duration: 100 }} editor={editor}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            Strike
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            h1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            h2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            h3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            highlight
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            left
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            center
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
          >
            right
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={
              editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
            }
          >
            justify
          </button>
          <button onClick={() => addImage(editor)}>add image from URL</button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive("taskList") ? "is-active" : ""}
          >
            toggleTaskList
          </button>
          <button
            onClick={() =>
              editor.chain().focus().splitListItem("taskItem").run()
            }
            disabled={!editor.can().splitListItem("taskItem")}
          >
            splitListItem
          </button>
          <button
            onClick={() =>
              editor.chain().focus().sinkListItem("taskItem").run()
            }
            disabled={!editor.can().sinkListItem("taskItem")}
          >
            sinkListItem
          </button>
          <button
            onClick={() =>
              editor.chain().focus().liftListItem("taskItem").run()
            }
            disabled={!editor.can().liftListItem("taskItem")}
          >
            liftListItem
          </button>
          <button
            onClick={setLink}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            setLink
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
          >
            unsetLink
          </button>
          <input
            type="color"
            onInput={(event) =>
              editor.chain().focus().setColor(event.currentTarget.value).run()
            }
            value={editor.getAttributes("textStyle").color}
          />
          <button
            onClick={() => editor.chain().focus().setColor("#958DF1").run()}
            className={
              editor.isActive("textStyle", { color: "#958DF1" })
                ? "is-active"
                : ""
            }
          >
            purple
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#F98181").run()}
            className={
              editor.isActive("textStyle", { color: "#F98181" })
                ? "is-active"
                : ""
            }
          >
            red
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#FBBC88").run()}
            className={
              editor.isActive("textStyle", { color: "#FBBC88" })
                ? "is-active"
                : ""
            }
          >
            orange
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#FAF594").run()}
            className={
              editor.isActive("textStyle", { color: "#FAF594" })
                ? "is-active"
                : ""
            }
          >
            yellow
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#70CFF8").run()}
            className={
              editor.isActive("textStyle", { color: "#70CFF8" })
                ? "is-active"
                : ""
            }
          >
            blue
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#94FADB").run()}
            className={
              editor.isActive("textStyle", { color: "#94FADB" })
                ? "is-active"
                : ""
            }
          >
            teal
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#B9F18D").run()}
            className={
              editor.isActive("textStyle", { color: "#B9F18D" })
                ? "is-active"
                : ""
            }
          >
            green
          </button>
          <button onClick={() => editor.chain().focus().unsetColor().run()}>
            unsetColor
          </button>
          <section className="comment-adder-section bg-white shadow-lg">
            <textarea
              value={commentText}
              onInput={(e) => setCommentText(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  setComment();
                }
              }}
              cols={30}
              rows={4}
              placeholder="Add comment..."
              className="border-none outline-none"
            />

            <section className="flex w-full flex-row gap-1">
              <button
                className="w-1/4 rounded border border-slate-500 bg-transparent py-2 px-4 font-semibold text-slate-700 shadow-lg hover:border-transparent hover:bg-slate-500 hover:text-white"
                onClick={() => setCommentText("")}
              >
                Clear
              </button>

              <button
                className="w-1/4 rounded border border-yellow-500 bg-transparent py-2 px-4 font-semibold text-yellow-700 shadow-lg hover:border-transparent hover:bg-yellow-500 hover:text-white"
                onClick={() => toggleComment()}
              >
                Toggle
              </button>

              <button
                className="w-2/4 rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 shadow-lg hover:border-transparent hover:bg-blue-500 hover:text-white"
                onClick={() => setComment()}
              >
                Add
              </button>
            </section>
          </section>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu tippyOptions={{ duration: 100 }} editor={editor}>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Bullet List
          </button>
          <button onClick={() => addImage(editor)}>addImage</button>
        </FloatingMenu>
      )}

      <EditorContent className="prose" editor={editor} />

      <section className="flex flex-col">
        {allComments.map((comment, i) => {
          return (
            <article
              className={`comment external-comment my-2 overflow-hidden rounded-md bg-gray-100 shadow-lg transition-all ${
                comment.jsonComments.uuid === activeCommentsInstance.uuid
                  ? "ml-4"
                  : "ml-8"
              }`}
              key={i + "external_comment"}
            >
              {comment.jsonComments.comments.map((jsonComment, j: number) => {
                return (
                  <article
                    key={`${j}_${Math.random()}`}
                    className="external-comment border-b-2 border-gray-200 p-3"
                  >
                    <div className="comment-details">
                      <strong>{jsonComment.userName}</strong>

                      <span className="date-time ml-1 text-xs">
                        {formatDate(jsonComment.time, dateTimeFormat)}
                      </span>
                    </div>

                    <span className="content">{jsonComment.content}</span>
                  </article>
                );
              })}

              {comment.jsonComments.uuid === activeCommentsInstance.uuid && (
                <section className="flex w-full flex-col gap-1">
                  <textarea
                    value={commentText}
                    onInput={(e) => setCommentText(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        setComment();
                      }
                    }}
                    cols={30}
                    rows={4}
                    placeholder="Add comment..."
                    className="border-none outline-none"
                  />

                  <section className="flex w-full flex-row gap-1">
                    <button
                      className="w-1/4 rounded-lg border border-slate-500 bg-transparent py-2 px-4 font-semibold text-slate-700 shadow-lg hover:border-transparent hover:bg-slate-500 hover:text-white"
                      onClick={() => setCommentText("")}
                    >
                      Clear
                    </button>

                    <button
                      className="w-1/4 rounded-lg border border-rose-500 bg-transparent py-2 px-4 font-semibold text-rose-700 shadow-lg hover:border-transparent hover:bg-rose-500 hover:text-white"
                      onClick={() => unsetComment()}
                    >
                      Resolved
                    </button>

                    <button
                      className="w-2/4 rounded-lg border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 shadow-lg hover:border-transparent hover:bg-blue-500 hover:text-white"
                      onClick={() => setComment()}
                    >
                      Add (<kbd className="">Enter</kbd>)
                    </button>
                  </section>
                </section>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Tiptap;
