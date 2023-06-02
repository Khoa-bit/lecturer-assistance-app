import type { Editor } from "@tiptap/core";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";

export interface CommentSpan {
  node: Node;
  commentDialog: CommentDialog; // CommentDialog will be convert to JSON and store in comment Mark
  fromPos: number;
  toPos: number;
  text: string;
}

export interface CommentDialog {
  uuid?: string;
  comments?: UserComment[];
}

export interface UserComment {
  userId: string;
  userAvatar: string;
  username: string;
  time: number;
  content: string;
}

export interface GetCommentFunctionsRetuns {
  findAllCommentSpans: (editor: Editor) => CommentSpan[];
  getActiveCommentDialog: getActiveCommentDialogType;
  setComment: (
    editor: Editor,
    commentText: string,
    allCommentSpans: CommentSpan[],
    activeCommentDialog: CommentDialog,
    userId: string,
    userAvatar: string,
    username: string
  ) => boolean;
  toggleComment: (editor: Editor) => boolean;
  unsetComment: (editor: Editor) => boolean;
}

export interface UseCommentStateReturns {
  setIsTextSelected: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  activeCommentDialog: CommentDialog;
  setCommentText: (value: ((prevState: string) => string) | string) => void;
  setActiveCommentDialog: (
    value: ((prevState: CommentDialog) => CommentDialog) | CommentDialog
  ) => void;
  setAllCommentSpans: (
    value: ((prevState: CommentSpan[]) => CommentSpan[]) | CommentSpan[]
  ) => void;
  isTextSelected: boolean;
  allCommentSpans: CommentSpan[];
  commentText: string;
}

export function useCommentState(): UseCommentStateReturns {
  const [commentText, setCommentText] = useState("");

  const [isTextSelected, setIsTextSelected] = useState(false);

  const [activeCommentDialog, setActiveCommentDialog] = useState<CommentDialog>(
    {}
  );

  const [allCommentSpans, setAllCommentSpans] = useState<CommentSpan[]>([]);

  return {
    commentText,
    setCommentText,
    isTextSelected,
    setIsTextSelected,
    activeCommentDialog,
    setActiveCommentDialog,
    allCommentSpans,
    setAllCommentSpans,
  };
}

export function getCommentFunctions(): GetCommentFunctionsRetuns {
  return {
    findAllCommentSpans,
    getActiveCommentDialog,
    setComment,
    toggleComment,
    unsetComment,
  };
}

export function useInitComments(
  editor: Editor | null,
  setAllCommentSpans: Dispatch<SetStateAction<CommentSpan[]>>
) {
  useEffect(() => {
    if (editor)
      setTimeout(() => setAllCommentSpans(findAllCommentSpans(editor)), 100);
  }, [editor, setAllCommentSpans]);
}

// Find all comments inside an editor document
const findAllCommentSpans = (editor: Editor): CommentSpan[] => {
  const allCommentSpans: CommentSpan[] = [];

  editor.state.doc.descendants((node, pos) => {
    const { marks } = node;

    marks.forEach((mark) => {
      if (mark.type.name === "comment") {
        const markComments = mark.attrs.comment;

        const jsonComments = markComments
          ? SuperJSON.parse<CommentDialog>(markComments)
          : {};

        if (jsonComments !== null) {
          allCommentSpans.push({
            node: editor.view.domAtPos(pos).node,
            commentDialog: jsonComments,
            fromPos: pos,
            toPos: pos + (node.text?.length || 0),
            text: node.text ?? "",
          });
        }
      }
    });
  });

  return allCommentSpans;
};

type getActiveCommentDialogType = (editor: Editor) => {
  isTextSelected: boolean;
  activeCommentDialog: CommentDialog;
};

const getActiveCommentDialog: getActiveCommentDialogType = (editor) => {
  const newVal = editor.isActive("comment");

  if (!newVal) {
    return {
      activeCommentDialog: {},
      isTextSelected: false,
    };
  }

  const parsedComment = SuperJSON.parse<CommentDialog>(
    editor.getAttributes("comment").comment
  );

  parsedComment.comments =
    typeof parsedComment.comments === "string"
      ? SuperJSON.parse<UserComment[]>(parsedComment.comments)
      : parsedComment.comments;

  return {
    activeCommentDialog: parsedComment,
    isTextSelected: true,
  };
};

const setComment = (
  editor: Editor,
  commentText: string,
  allCommentSpans: CommentSpan[],
  activeCommentDialog: CommentDialog,
  userId: string,
  userAvatar: string,
  username: string
): boolean => {
  if (!commentText.trim().length) return false;

  const commentsArray = activeCommentDialog.comments;

  let commentDialog: string;
  if (commentsArray) {
    commentsArray.push({
      userId,
      username,
      userAvatar,
      time: Date.now(),
      content: commentText,
    });

    commentDialog = SuperJSON.stringify({
      uuid: activeCommentDialog.uuid || Math.random().toString(),
      comments: commentsArray,
    } as CommentDialog);
  } else {
    commentDialog = SuperJSON.stringify({
      uuid: Math.random().toString(),
      comments: [
        {
          userId,
          username,
          userAvatar,
          time: Date.now(),
          content: commentText,
        },
      ],
    } as CommentDialog);
  }

  editor?.chain().focus().setCommentDialog(commentDialog).run();

  const sameUUIDComments = allCommentSpans.filter(
    (commentParent) =>
      commentParent.commentDialog.uuid == activeCommentDialog.uuid
  );

  let minPos = sameUUIDComments.at(0)?.fromPos ?? 0;
  let maxPos = sameUUIDComments.at(0)?.toPos ?? 0;
  sameUUIDComments.forEach((commentParent) => {
    const fromPos = commentParent.fromPos;
    const toPos = commentParent.toPos;

    editor
      ?.chain()
      .setTextSelection({
        from: fromPos,
        to: toPos,
      })
      .setCommentDialog(commentDialog)
      .run();

    minPos = Math.min(minPos, fromPos);
    maxPos = Math.max(maxPos, toPos);
  });

  return editor
    ?.chain()
    .setTextSelection({
      from: minPos,
      to: maxPos,
    })
    .focus()
    .run();
};

const toggleComment = (editor: Editor): boolean => {
  const commentJSON =
    (editor.getAttributes("comment").comment as string) || null;

  if (!commentJSON) return false;

  return editor?.chain().focus().toggleCommentDialog(commentJSON).run();
};

const unsetComment = (editor: Editor): boolean => {
  return editor.chain().focus().unsetCommentDialog().run();
};
