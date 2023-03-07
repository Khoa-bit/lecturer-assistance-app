import { getMarkRange, Mark, mergeAttributes } from "@tiptap/react";
import { Plugin, TextSelection } from "prosemirror-state";

export interface CommentOptions {
  HTMLAttributes: Record<string, unknown>;
  isCommentModeOn: () => boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Set a comment mark
       */
      setCommentDialog: (commentDialog: string) => ReturnType;
      /**
       * Toggle a comment mark
       */
      toggleCommentDialog: (commentDialog: string) => ReturnType;
      /**
       * Unset a comment mark
       */
      unsetCommentDialog: () => ReturnType;
    };
  }
}

export const Comment = Mark.create<CommentOptions>({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: { class: "bg-emerald-300" },
      isCommentModeOn: () => false,
    };
  },

  addAttributes() {
    return {
      comment: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-comment"),
        renderHTML: (attrs) => ({ "data-comment": attrs.comment }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-comment]",
        getAttrs: (el) =>
          !!(el as HTMLSpanElement).getAttribute("data-comment")?.trim() &&
          null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCommentDialog:
        (commentDialog) =>
        ({ commands }) =>
          commands.setMark("comment", { comment: commentDialog }),
      toggleCommentDialog:
        (commentDialog) =>
        ({ commands }) =>
          commands.toggleMark("comment", { comment: commentDialog }),
      unsetCommentDialog:
        () =>
        ({ commands }) =>
          commands.unsetMark("comment", { extendEmptyMarkRange: true }),
    };
  },

  addProseMirrorPlugins() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extensionThis = this;

    const plugins = [
      new Plugin({
        props: {
          handleClick(view, pos) {
            if (!extensionThis.options.isCommentModeOn()) return false;

            const { schema, doc, tr } = view.state;

            const comment = schema.marks.comment;
            if (comment == undefined) return;

            const range = getMarkRange(doc.resolve(pos), comment);

            if (!range) return false;

            const [$start, $end] = [
              doc.resolve(range.from),
              doc.resolve(range.to),
            ];

            view.dispatch(tr.setSelection(new TextSelection($start, $end)));

            return true;
          },
        },
      }),
    ];

    return plugins;
  },
});
