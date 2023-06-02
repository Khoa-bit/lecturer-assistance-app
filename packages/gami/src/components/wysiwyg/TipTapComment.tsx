import {EditorContent, useEditor} from "@tiptap/react";
import type {Step} from "prosemirror-transform";
import type {PeopleResponse} from "raito";
import {ParticipantsPermissionOptions} from "raito";
import {useEffect, useMemo, useState} from "react";
import SuperJSON from "superjson";
import {customExtensionsFull} from "./TipTap";
import {getCommentFunctions, useCommentState, useInitComments,} from "./tiptapCommentExtension/commentHooks";
import TipTapBubbleMenu from "./TipTapBubbleMenu";
import TipTapCommentCards from "./TipTapCommentCards";
import type {PBCustom} from "../../types/pb-custom";

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
  pbClient: PBCustom;
  userPerson?: PeopleResponse;
}

const TipTapComment = ({
  id,
  onChange,
  richText,
  pbClient,
  userPerson,
}: TipTapProps) => {
  const username = userPerson?.name ?? "Anonymous";
  const userId = userPerson?.id ?? "";
  const userAvatar = userPerson?.avatar ?? "";

  const content: object = SuperJSON.parse(
    richText.length >= 2
      ? richText
      : `{"json":{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"}}]}}`
  );

  const [prevContent, setPrevContent] = useState(content);

  const commentState = useCommentState();
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

  const commentFunctions = getCommentFunctions();
  const {
    findAllCommentSpans,
    getActiveCommentDialog,
    setComment,
    toggleComment,
    unsetComment,
  } = commentFunctions;

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
        <TipTapBubbleMenu
          editor={editor}
          setLink={() => null}
          userId={userId}
          userAvatar={userAvatar}
          username={username}
          permission={ParticipantsPermissionOptions.comment}
          commentState={commentState}
          commentFunctions={commentFunctions}
        ></TipTapBubbleMenu>
      )}

      <EditorContent id={id} key="editor" editor={editor} />

      <TipTapCommentCards
        allUniqueComments={allUniqueComments}
        editor={editor}
        pbClient={pbClient}
        userId={userId}
        userAvatar={userAvatar}
        username={username}
        canComment={true}
        commentState={commentState}
        commentFunctions={commentFunctions}
      ></TipTapCommentCards>
    </div>
  );
};

export default TipTapComment;
