import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Step } from "prosemirror-transform";
import type { UsersResponse } from "raito";
import { useMemo } from "react";
import { formatDate } from "src/lib/input_handling";
import type { RichText } from "src/types/documents";
import SuperJSON from "superjson";
import CustomImage from "./customImageExtension/image";
import suggestion from "./suggestion";
import { Comment } from "./tiptapCommentExtension/comment";
import { useComment } from "./tiptapCommentExtension/commentHooks";

// Per extension modification inspect the `editor.schema.marks` to get all active Marks
type MarkType =
  | "bold"
  | "code"
  | "comment"
  | "highlight"
  | "italic"
  | "link"
  | "strike"
  | "textStyle";

interface AddMarkStep extends Step {
  mark?: { type: { name: MarkType } };
}

interface TipTapProps {
  onChange: (...event: unknown[]) => void;
  richText: RichText;
  user: UsersResponse;
}

const dateTimeFormat = "dd-MM-yyyy HH:mm:ss";

const TipTapComment = ({ onChange, richText, user }: TipTapProps) => {
  const editor = useEditor({
    onCreate: ({ editor }) => {
      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()) },
      });
    },

    onUpdate: ({ editor, transaction }) => {
      // Accept only Undo and Comment Mark
      if (
        transaction.getMeta("history$")?.redo != false &&
        transaction.steps.some(
          (step) => (step as AddMarkStep).mark?.type?.name != "comment"
        )
      ) {
        editor.commands.undo();
        window.prompt("You can only comment");
      }

      findCommentsAndStoreValues(editor);

      setCurrentComment(editor);

      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()) },
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
      CustomImage,
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
    content: richText?.json,
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

  const allUniqueComments = useMemo(() => {
    const foundUUIDSet = new Set<string>();
    return allComments.filter((commentParent) => {
      const curUUID = commentParent.commentDialog.uuid;
      if (!curUUID || foundUUIDSet.has(curUUID)) return false;

      foundUUIDSet.add(commentParent.commentDialog.uuid ?? "unknown");
      return true;
    });
  }, [allComments]);

  if (!editor) {
    return <></>;
  }

  const focusContent = ({ from, to }: { from: number; to: number }) => {
    editor.chain().setTextSelection({ from, to }).run();
  };

  return (
    <div>
      {editor && (
        <BubbleMenu
          tippyOptions={{ duration: 100, hideOnClick: true }}
          editor={editor}
        >
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

      <EditorContent className="prose" editor={editor} />

      <section className="flex flex-col">
        {allUniqueComments.map((comment, i) => {
          if (!comment.commentDialog.comments) return <></>;

          return (
            <article
              className={`comment external-comment my-2 overflow-hidden rounded-md bg-gray-100 shadow-lg transition-all ${
                comment.commentDialog.uuid === activeCommentsInstance.uuid
                  ? "ml-4"
                  : "ml-8"
              }`}
              key={i + "external_comment"}
            >
              {comment.commentDialog.comments.map((jsonComment, j: number) => {
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

              {comment.commentDialog.uuid === activeCommentsInstance.uuid && (
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

export default TipTapComment;
