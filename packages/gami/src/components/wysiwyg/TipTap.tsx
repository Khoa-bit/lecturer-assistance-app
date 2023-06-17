import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { AttachmentsResponse, PeopleResponse } from "src/types/raito";
import { ParticipantsPermissionOptions } from "src/types/raito";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import CustomImage from "./customImageExtension/image";
import useImage from "./customImageExtension/imageHooks";
import { Comment } from "./tiptapCommentExtension/comment";
import {
  getCommentFunctions,
  useCommentState,
  useInitComments,
} from "./tiptapCommentExtension/commentHooks";
import TipTapBubbleMenu from "./TipTapBubbleMenu";
import TipTapFloatingMenu from "./TipTapFloatingMenu";
import TipTapCommentCards from "./TipTapCommentCards";

interface TipTapProps {
  id?: string;
  onChange: (...event: unknown[]) => void;
  richText: string;
  documentId: string;
  pbClient: PBCustom;
  userPerson?: PeopleResponse;
  setCurAttachments: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>;
}

export const customExtensionsFull = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight.configure({
    multicolor: true,
  }),
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
  // Mention.configure({
  //   HTMLAttributes: {
  //     class: "mention",
  //   },
  //   suggestion,
  // }),
  Comment,
];

export const customExtensions = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Link,
  TextStyle,
  Color,
  Typography,
  TaskList.configure({
    HTMLAttributes: {
      class: "pl-0",
    },
  }),
  TaskItem.configure({
    nested: true,
  }),
  // Mention.configure({
  //   HTMLAttributes: {
  //     class: "mention",
  //   },
  //   suggestion,
  // }),
  Comment,
];

const TipTap = ({
  id,
  onChange,
  richText,
  documentId,
  pbClient,
  userPerson,
  setCurAttachments,
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

  const { imageProxy, imageHandleDrop, addImage } = useImage(
    pbClient,
    documentId,
    setCurAttachments
  );

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

    onUpdate: ({ editor }) => {
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
      handleDrop: function (view, event, slice, moved) {
        return imageHandleDrop(view, event, moved);
      },
    },

    extensions: [...customExtensions, CustomImage.configure({ imageProxy })],
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

  const focusContent = ({ from, to }: { from: number; to: number }) => {
    editor.chain().setTextSelection({ from, to }).run();
  };

  return (
    <div>
      {editor && (
        <TipTapBubbleMenu
          editor={editor}
          setLink={setLink}
          userId={userId}
          userAvatar={userAvatar}
          username={username}
          permission={ParticipantsPermissionOptions.write}
          commentState={commentState}
          commentFunctions={commentFunctions}
        ></TipTapBubbleMenu>
      )}

      {editor && <TipTapFloatingMenu editor={editor}></TipTapFloatingMenu>}

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

export default TipTap;
