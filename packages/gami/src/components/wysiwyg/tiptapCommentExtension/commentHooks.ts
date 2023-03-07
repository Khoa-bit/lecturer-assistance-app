import type { Editor } from "@tiptap/core";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";

interface CommentInstance {
  uuid?: string;
  comments?: unknown[];
}

export interface AllCommentDialogs {
  node: Element;
  jsonComments: CommentDialog;
}

export interface CommentDialog {
  uuid?: string;
  comments: UserComment[];
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
  activeCommentsInstance: CommentInstance;
  setActiveCommentsInstance: Dispatch<SetStateAction<CommentInstance>>;
  allComments: AllCommentDialogs[];
  setAllComments: Dispatch<SetStateAction<AllCommentDialogs[]>>;
  findCommentsAndStoreValues: () => void;
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
    useState<CommentInstance>({});

  const [allComments, setAllComments] = useState<AllCommentDialogs[]>([]);

  const findCommentsAndStoreValues = () => {
    const proseMirror = document.querySelector(".ProseMirror");

    const comments = proseMirror?.querySelectorAll("span[data-comment]");

    const tempComments: AllCommentDialogs[] = [];

    if (!comments) {
      setAllComments([]);
      return;
    }

    comments.forEach((node) => {
      const nodeComments = node.getAttribute("data-comment");

      const jsonComments = nodeComments
        ? SuperJSON.parse<CommentDialog>(nodeComments)
        : null;

      if (jsonComments !== null) {
        tempComments.push({
          node,
          jsonComments,
        });
      }
    });

    setAllComments(tempComments);
  };

  const setCurrentComment = (editor: Editor) => {
    const newVal = editor.isActive("comment");

    if (!newVal) {
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

    setIsTextSelected(false);
    const selection = editor.view.state.selection;
    const selectionLength = selection.$head.pos - selection.$anchor.pos;
    const commentedDom = editor.view.domAtPos(selection.$anchor.pos, 1);

    if (
      selectionLength == 0 ||
      (commentedDom.offset == 0 &&
        commentedDom.node.textContent?.length == selectionLength)
    ) {
      setIsTextSelected(true);
      setActiveCommentsInstance(parsedComment);
      return;
    }

    setActiveCommentsInstance({});
  };

  const setComment = () => {
    if (!commentText.trim().length) return;

    const commentsArray = activeCommentsInstance.comments;

    if (commentsArray) {
      commentsArray.push({
        userName: currentUserName,
        time: Date.now(),
        content: commentText,
      });

      const commentDialog = SuperJSON.stringify({
        uuid: activeCommentsInstance.uuid || Math.random().toString(),
        comments: commentsArray,
      } as CommentDialog);

      editor?.chain().setCommentDialog(commentDialog).run();
    } else {
      const commentDialog = SuperJSON.stringify({
        uuid: Math.random().toString(),
        comments: [
          {
            userName: currentUserName,
            time: Date.now(),
            content: commentText,
          },
        ],
      } as CommentDialog);

      editor?.chain().setCommentDialog(commentDialog).run();
    }

    setTimeout(() => setCommentText(""), 50);
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
    setTimeout(findCommentsAndStoreValues, 100);
  }, []);

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
