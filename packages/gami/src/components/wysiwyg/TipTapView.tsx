import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "src/lib/input_handling";
import SuperJSON from "superjson";
import CustomImage from "./customImageExtension/image";
import suggestion from "./suggestion";
import { Comment } from "./tiptapCommentExtension/comment";
import {
  getCommentFunctions,
  useCommentState,
  useInitComments,
} from "./tiptapCommentExtension/commentHooks";

interface TipTapProps {
  richText: string;
}

const dateTimeFormat = "dd-MM-yyyy HH:mm:ss";

const TipTapView = ({ richText }: TipTapProps) => {
  const content: object = SuperJSON.parse(
    richText.length >= 2 ? richText : "{}"
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
    content: content,
  });

  useEffect(() => {
    if (SuperJSON.stringify(prevContent) == SuperJSON.stringify(content))
      return;

    editor?.commands.setContent(content);
    setPrevContent(content);
  }, [editor?.commands, content, prevContent]);

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
      <EditorContent key="editor" className="prose" editor={editor} />

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
