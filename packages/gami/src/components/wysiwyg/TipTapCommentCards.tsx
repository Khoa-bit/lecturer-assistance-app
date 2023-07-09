import { dateTimeFormat, formatDate } from "../../lib/input_handling";
import type {
  CommentSpan,
  GetCommentFunctionsRetuns,
  UseCommentStateReturns,
} from "./tiptapCommentExtension/commentHooks";
import type { Editor } from "@tiptap/react";
import account_circle_black from "../../../public/account_circle_black.png";
import ImageFallback from "../ImageFallback";
import React from "react";
import type { PBCustom } from "../../types/pb-custom";

interface TipTapCommentCardsProps {
  allUniqueComments: CommentSpan[];
  editor: Editor;
  pbClient: PBCustom;
  userId: string;
  userAvatar: string;
  username: string;
  canComment: boolean;
  commentState: UseCommentStateReturns;
  commentFunctions: GetCommentFunctionsRetuns;
}

export default function TipTapCommentCards({
  allUniqueComments,
  editor,
  pbClient,
  userId,
  username,
  userAvatar,
  canComment,
  commentState,
  commentFunctions,
}: TipTapCommentCardsProps) {
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

  const {
    findAllCommentSpans,
    getActiveCommentDialog,
    setComment,
    toggleComment,
    unsetComment,
  } = commentFunctions;
  // if (!editor.isFocused) setActiveCommentDialog({});

  return (
    <section className="flex flex-col">
      {allUniqueComments.map((comment, i) => {
        if (!comment.commentDialog.comments) return <></>;
        return (
          <article
            className={`my-2 overflow-hidden rounded-md bg-gray-100 shadow-lg transition-all ${
              comment.commentDialog.uuid === activeCommentDialog.uuid
                ? "ml-2 bg-white"
                : "ml-6"
            }`}
            onClick={() => {
              if (comment.commentDialog.uuid === activeCommentDialog.uuid)
                return;
              editor.chain().focus(comment.fromPos).run();
            }}
            key={i + "external_comment"}
          >
            {comment.commentDialog.comments.map((jsonComment, j: number) => {
              return (
                <article
                  key={`${j}_${Math.random()}`}
                  className="external-comment flex flex-col gap-2 border-b-2 border-gray-200 p-3"
                >
                  <div className="grid w-fit grid-cols-[max-content_1fr]">
                    <ImageFallback
                      className="row-span-2 mr-2 h-9 w-9 rounded-full"
                      src={pbClient.buildUrl(
                        `api/files/people/${jsonComment.userId}/${jsonComment.userAvatar}?thumb=36x36`
                      )}
                      fallbackSrc={account_circle_black}
                      alt="Uploaded avatar"
                      width={36}
                      height={36}
                    />
                    <strong>{jsonComment.username}</strong>

                    <small className="date-time text-xs">
                      {formatDate(jsonComment.time, dateTimeFormat)}
                    </small>
                  </div>

                  <span className="content">{jsonComment.content}</span>
                </article>
              );
            })}

            {canComment &&
              comment.commentDialog.uuid === activeCommentDialog.uuid && (
                <section className="bg-white p-2 shadow-lg shadow-gray-400">
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
                          userId,
                          userAvatar,
                          username
                        );
                        setCommentText("");
                      }
                    }}
                    rows={4}
                    placeholder="Add comment..."
                    className="textarea-bordered textarea mb-2 w-full"
                  />

                  <section className="flex w-full flex-row gap-1.5">
                    <button
                      className="w-1/4 rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700 transition-colors hover:border-transparent hover:bg-slate-500 hover:text-slate-50"
                      onClick={() => setCommentText("")}
                    >
                      Clear
                    </button>

                    <button
                      className="w-1/4 rounded bg-green-100 px-2 py-1 font-semibold text-green-700 transition-colors hover:border-transparent hover:bg-green-500 hover:text-green-50"
                      onClick={() => unsetComment(editor)}
                    >
                      Resolved
                    </button>

                    <button
                      className="w-2/4 rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700 transition-colors hover:border-transparent hover:bg-blue-500 hover:text-blue-50"
                      onClick={() => {
                        setComment(
                          editor,
                          commentText,
                          allCommentSpans,
                          activeCommentDialog,
                          userId,
                          userAvatar,
                          username
                        );
                        setCommentText("");
                      }}
                    >
                      Add
                    </button>
                  </section>
                </section>
              )}
          </article>
        );
      })}
    </section>
  );
}
