import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import type { Step } from "prosemirror-transform";
import type { UsersResponse } from "raito";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "src/lib/input_handling";
import SuperJSON from "superjson";
import { customExtensionsFull } from "./TipTap";
import CustomImage from "./customImageExtension/image";
import {
  getCommentFunctions,
  useCommentState,
  useInitComments,
} from "./tiptapCommentExtension/commentHooks";

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
  id?: string;
  onChange: (...event: unknown[]) => void;
  richText: string;
  user: UsersResponse;
}

const dateTimeFormat = "dd-MM-yyyy HH:mm:ss";

const TipTapComment = ({ id, onChange, richText, user }: TipTapProps) => {
  const username = user?.username ?? "Anonymous";
  const content: object = SuperJSON.parse(
    richText.length >= 2
      ? richText
      : `{"json":{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}}]}}`
  );

  const [prevContent, setPrevContent] = useState(content);

  const {
    commentText,
    setCommentText,
    isTextSelected,
    setIsTextSelected,
    activeCommentDialog,
    setActiveCommentDialog,
    allCommentSpans,
    setAllCommentSpans,
  } = useCommentState();

  const {
    findAllCommentSpans,
    getActiveCommentDialog,
    setComment,
    toggleComment,
    unsetComment,
  } = getCommentFunctions();

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

      setAllCommentSpans(findAllCommentSpans(editor));

      const { isTextSelected, activeCommentDialog } =
        getActiveCommentDialog(editor);

      setActiveCommentDialog(activeCommentDialog);
      setIsTextSelected(isTextSelected);

      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()) },
      });
    },

    onSelectionUpdate({ editor }) {
      const { isTextSelected, activeCommentDialog } =
        getActiveCommentDialog(editor);

      setActiveCommentDialog(activeCommentDialog);
      setIsTextSelected(!!editor.state.selection.content().size);
    },

    editorProps: {
      attributes: {
        class: "prose mx-auto focus:outline-none",
      },
    },

    extensions: customExtensionsFull,
    content: content,
  });

  useEffect(() => {
    if (
      SuperJSON.stringify(prevContent) == SuperJSON.stringify(content) ||
      !editor
    ) {
      return;
    }

    // Save cursor position
    const { tr } = editor.view.state;

    // Reload cursor position
    editor
      ?.chain()
      .setContent(content)
      .setTextSelection({
        from: tr.selection.$from.pos,
        to: tr.selection.$to.pos,
      })
      .focus()
      .run();

    setPrevContent(content);
  }, [content, prevContent, editor]);

  useInitComments(editor, setAllCommentSpans);

  const allUniqueComments = useMemo(() => {
    const foundUUIDSet = new Set<string>();
    return allCommentSpans.filter((commentParent) => {
      const curUUID = commentParent.commentDialog.uuid;
      if (!curUUID || foundUUIDSet.has(curUUID)) return false;

      foundUUIDSet.add(commentParent.commentDialog.uuid ?? "unknown");
      return true;
    });
  }, [allCommentSpans]);

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
              className="border-none outline-none"
            />

            <section className="flex w-full flex-row gap-1">
              <button
                className="w-1/4 rounded border border-slate-500 bg-transparent px-4 py-2 font-semibold text-slate-700 shadow-lg hover:border-transparent hover:bg-slate-500 hover:text-white"
                onClick={() => setCommentText("")}
              >
                Clear
              </button>

              <button
                className="w-1/4 rounded border border-yellow-500 bg-transparent px-4 py-2 font-semibold text-yellow-700 shadow-lg hover:border-transparent hover:bg-yellow-500 hover:text-white"
                onClick={() => toggleComment(editor)}
              >
                Toggle
              </button>

              <button
                className="w-2/4 rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 shadow-lg hover:border-transparent hover:bg-blue-500 hover:text-white"
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
          </section>
        </BubbleMenu>
      )}

      <EditorContent id={id} key="editor" className="prose" editor={editor} />

      <section className="flex flex-col">
        {allUniqueComments.map((comment, i) => {
          if (!comment.commentDialog.comments) return <></>;

          return (
            <article
              className={`comment external-comment my-2 overflow-hidden rounded-md bg-gray-100 shadow-lg transition-all ${
                comment.commentDialog.uuid === activeCommentDialog.uuid
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
                      <strong>{jsonComment.username}</strong>

                      <span className="date-time ml-1 text-xs">
                        {formatDate(jsonComment.time, dateTimeFormat)}
                      </span>
                    </div>

                    <span className="content">{jsonComment.content}</span>
                  </article>
                );
              })}

              {comment.commentDialog.uuid === activeCommentDialog.uuid && (
                <section className="flex w-full flex-col gap-1">
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
                    className="border-none outline-none"
                  />

                  <section className="flex w-full flex-row gap-1">
                    <button
                      className="w-1/4 rounded-lg border border-slate-500 bg-transparent px-4 py-2 font-semibold text-slate-700 shadow-lg hover:border-transparent hover:bg-slate-500 hover:text-white"
                      onClick={() => setCommentText("")}
                    >
                      Clear
                    </button>

                    <button
                      className="w-1/4 rounded-lg border border-rose-500 bg-transparent px-4 py-2 font-semibold text-rose-700 shadow-lg hover:border-transparent hover:bg-rose-500 hover:text-white"
                      onClick={() => unsetComment(editor)}
                    >
                      Resolved
                    </button>

                    <button
                      className="w-2/4 rounded-lg border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 shadow-lg hover:border-transparent hover:bg-blue-500 hover:text-white"
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
                      Add (<kbd>Enter</kbd>)
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
