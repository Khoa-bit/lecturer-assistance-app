import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SuperJSON from "superjson";

interface TipTapProps {
  name: string;
  onChange: (...event: unknown[]) => void;
  value?: { json: object };
}

const Tiptap = ({ name, onChange, value }: TipTapProps) => {
  const editor = useEditor({
    onCreate: ({ editor }) => {
      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()), name },
      });
    },
    onUpdate: ({ editor }) => {
      onChange({
        target: { value: SuperJSON.stringify(editor.getJSON()), name },
      });
    },
    extensions: [StarterKit],
    content: value?.json,
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
