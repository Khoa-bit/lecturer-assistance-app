import type { Editor } from "@tiptap/react";
import type PocketBase from "pocketbase";
import type { EditorView } from "prosemirror-view";
import type { AttachmentsResponse } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction } from "react";
import type { PBCustom } from "src/types/pb-custom";

export type ImageProxyType = (imageBlob: Blob) => Promise<{
  imageURL: string;
}>;

export type ImageHandleDropType = (
  view: EditorView,
  event: DragEvent,
  moved: boolean
) => boolean;

export type AddImageType = (editor: Editor) => Promise<void>;

export type useImageType = (
  pbClient: PBCustom,
  documentId: string,
  setCurAttachments: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>
) => {
  imageProxy: ImageProxyType;
  imageHandleDrop: ImageHandleDropType;
  addImage: AddImageType;
};

const useImage: useImageType = (pbClient, documentId, setCurAttachments) => {
  const imageProxy: ImageProxyType = async (imageBlob) => {
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("document", documentId);

    const newImage = await pbClient
      .collection(Collections.Attachments)
      .create<AttachmentsResponse>(formData, {
        $autoCancel: false,
      });

    const imageURL = pbClient.buildUrl(
      `api/files/attachments/${newImage.id}/${newImage.file}`
    );

    setCurAttachments((curAttachments) => [...curAttachments, newImage]);

    return { imageURL };
  };

  const imageHandleDrop: ImageHandleDropType = (view, event, moved) => {
    if (
      moved ||
      !event.dataTransfer ||
      !event.dataTransfer.files ||
      !event.dataTransfer.files[0]
    ) {
      return false; // not handled use default behavior
    }

    // if dropping external files
    const file = event.dataTransfer.files[0];

    // the dropped file
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      window.alert("Images need to be in jpg or png format.");
      return false; // not handled use default behavior
    }

    const { schema } = view.state;
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });

    setTimeout(async () => {
      const { imageURL } = await imageProxy(file);

      const schemaImage = schema.nodes.image;
      const pos = coordinates?.pos;
      if (schemaImage == undefined || pos == undefined) return;

      const node = schemaImage.create({ src: imageURL }); // creates the image element
      const transaction = view.state.tr.insert(pos, node); // places it in the correct position
      view.dispatch(transaction);
    }, 0);

    return true; // handled
  };

  const addImage = async (editor: Editor, alt?: string, title?: string) => {
    const url = window.prompt("URL");

    if (url) {
      editor.commands.setImage({
        src: url,
        alt: alt ?? "User input's image",
        title: title ?? "User image",
      });
    }
  };

  return {
    imageProxy,
    imageHandleDrop,
    addImage,
  };
};

export default useImage;
