import type { ImageOptions } from "@tiptap/extension-image";
import Image from "@tiptap/extension-image";
import SuperJSON from "superjson";
import type { ImageProxyType } from "./imageHooks";

interface CustomImageStorage {
  srcToProxy: Set<string>;
}

interface CustomImageOptions extends ImageOptions {
  imageProxy: ImageProxyType;
}

const CustomImage = Image.extend<CustomImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
    };
  },

  addStorage(): CustomImageStorage {
    return {
      srcToProxy: new Set<string>(),
    };
  },

  addAttributes() {
    return {
      src: {
        default: "404NotFound.png",
        renderHTML: (attributes) => {
          console.log(">> addAttributes.renderHTML");
          const thisStorage = this.storage as CustomImageStorage;
          const src = attributes.src as string;

          if (!src.startsWith("http://localhost:8090/api/files/attachments/"))
            thisStorage.srcToProxy.add(attributes.src);

          return {
            src: attributes.src,
          };
        },
      },
    };
  },

  async onUpdate(this) {
    const editor = this.editor;
    const outputJSON = SuperJSON.stringify(editor.getJSON());
    const thisStorage = this.storage as CustomImageStorage;

    for (const src of thisStorage.srcToProxy) {
      const imageRes = await fetch(src);

      const imageBlob = await imageRes.blob();

      const { imageURL } = await this.options.imageProxy(imageBlob);

      const newJSON = outputJSON.replace(src, imageURL);

      const lastPos = editor.view.state.selection.$anchor.pos;
      editor.commands.setContent(SuperJSON.parse(newJSON));
      editor.commands.setTextSelection(lastPos);
    }
    thisStorage.srcToProxy.clear();
  },
});

export default CustomImage;
