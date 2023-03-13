import type { Editor } from "@tiptap/core";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";

export interface CommentDialogParent {
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
  userName: string;
  time: number;
  content: string;
}

interface useCommentReturns {
  isCommentModeOn: boolean;
  setIsCommentModeOn: Dispatch<SetStateAction<boolean>>;
  currentUserName: string;
  setCurrentUserName: Dispatch<SetStateAction<string>>;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  showCommentMenu: boolean;
  setShowCommentMenu: Dispatch<SetStateAction<boolean>>;
  isTextSelected: boolean;
  setIsTextSelected: Dispatch<SetStateAction<boolean>>;
  showAddCommentSection: boolean;
  setShowAddCommentSection: Dispatch<SetStateAction<boolean>>;
  activeCommentsInstance: CommentDialog;
  setActiveCommentsInstance: Dispatch<SetStateAction<CommentDialog>>;
  allComments: CommentDialogParent[];
  setAllComments: Dispatch<SetStateAction<CommentDialogParent[]>>;
  findCommentsAndStoreValues: (editor: Editor) => void;
  setCurrentComment: (editor: Editor) => void;
  setComment: () => void;
  toggleCommentMode: () => void;
  toggleComment: () => void;
  unsetComment: () => void;
}

export function useComment(
  editor: Editor | null,
  userName: string
): useCommentReturns {
  const [isCommentModeOn, setIsCommentModeOn] = useState(false);

  const [currentUserName, setCurrentUserName] = useState(userName);

  const [commentText, setCommentText] = useState("");

  const [showCommentMenu, setShowCommentMenu] = useState(false);

  const [isTextSelected, setIsTextSelected] = useState(false);

  const [showAddCommentSection, setShowAddCommentSection] = useState(true);

  const [activeCommentsInstance, setActiveCommentsInstance] =
    useState<CommentDialog>({});

  const [allComments, setAllComments] = useState<CommentDialogParent[]>([]);

  const findCommentsAndStoreValues = (editor: Editor) => {
    const tempComments: CommentDialogParent[] = [];

    editor.state.doc.descendants((node, pos) => {
      const { marks } = node;

      marks.forEach((mark) => {
        if (mark.type.name === "comment") {
          const markComments = mark.attrs.comment;

          const jsonComments = markComments
            ? SuperJSON.parse<CommentDialog>(markComments)
            : {};

          if (jsonComments !== null) {
            tempComments.push({
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

    setAllComments(tempComments);
  };

  const setCurrentComment = (editor: Editor) => {
    const newVal = editor.isActive("comment");

    if (!newVal) {
      setIsTextSelected(false);
      setActiveCommentsInstance({});
      return;
    }

    setTimeout(() => setShowCommentMenu(newVal), 50);

    setShowAddCommentSection(!editor.state.selection.empty);

    const parsedComment = SuperJSON.parse<CommentDialog>(
      editor.getAttributes("comment").comment
    );

    parsedComment.comments =
      typeof parsedComment.comments === "string"
        ? SuperJSON.parse<UserComment[]>(parsedComment.comments)
        : parsedComment.comments;

    setIsTextSelected(true);
    setActiveCommentsInstance(parsedComment);
  };

  const setComment = () => {
    if (!commentText.trim().length) return;

    const commentsArray = activeCommentsInstance.comments;

    let commentDialog: string;
    if (commentsArray) {
      commentsArray.push({
        userName: currentUserName,
        time: Date.now(),
        content: commentText,
      });

      commentDialog = SuperJSON.stringify({
        uuid: activeCommentsInstance.uuid || Math.random().toString(),
        comments: commentsArray,
      } as CommentDialog);
    } else {
      commentDialog = SuperJSON.stringify({
        uuid: Math.random().toString(),
        comments: [
          {
            userName: currentUserName,
            time: Date.now(),
            content: commentText,
          },
        ],
      } as CommentDialog);
    }

    editor?.chain().focus().setCommentDialog(commentDialog).run();

    const sameUUIDComments = allComments.filter(
      (commentParent) =>
        commentParent.commentDialog.uuid == activeCommentsInstance.uuid
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

    setTimeout(() => {
      setCommentText("");

      editor
        ?.chain()
        .setTextSelection({
          from: minPos,
          to: maxPos,
        })
        .focus()
        .run();
    }, 50);
  };

  const toggleCommentMode = () => {
    setIsCommentModeOn(!isCommentModeOn);

    if (isCommentModeOn) editor?.setEditable(false);
    else editor?.setEditable(true);
  };

  const toggleComment = () => {
    if (!editor) return;

    const commentJSON =
      (editor.getAttributes("comment").comment as string) || null;

    if (!commentJSON) return;

    editor?.chain().focus().toggleCommentDialog(commentJSON).run();
  };

  const unsetComment = () => {
    if (!editor) return;

    editor.chain().focus().unsetCommentDialog().run();
  };

  useEffect(() => {
    if (editor) setTimeout(() => findCommentsAndStoreValues(editor), 100);
  }, [editor]);

  return {
    isCommentModeOn,
    setIsCommentModeOn,
    currentUserName,
    setCurrentUserName,
    commentText,
    setCommentText,
    showCommentMenu,
    setShowCommentMenu,
    isTextSelected,
    setIsTextSelected,
    showAddCommentSection,
    setShowAddCommentSection,
    activeCommentsInstance,
    setActiveCommentsInstance,
    allComments,
    setAllComments,
    findCommentsAndStoreValues,
    setCurrentComment,
    setComment,
    toggleCommentMode,
    toggleComment,
    unsetComment,
  };
}
