import { EditorContent, useEditor } from "@tiptap/react";
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

interface TipTapProps {
  id?: string;
  richText: string;
}

const dateTimeFormat = "dd-MM-yyyy HH:mm:ss";

const TipTapView = ({ id, richText }: TipTapProps) => {
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
    editable: false,

    onSelectionUpdate({ editor }) {
      const { isTextSelected, activeCommentDialog } =
        getActiveCommentDialog(editor);

      setActiveCommentDialog(activeCommentDialog);
      setIsTextSelected(!!editor.state.selection.content().size);
    },

    editorProps: {
      attributes: {
        class: "prose w-full mx-auto focus:outline-none",
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
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default TipTapView;
