import { useRouter } from "next/router";
import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";
import { debounce } from "src/lib/input_handling";

interface useDocHelperParams<T extends FieldValues> {
  hasSaved: MutableRefObject<boolean>;
  formRef: RefObject<HTMLFormElement>;
  submitRef: RefObject<HTMLInputElement>;
  watch: UseFormWatch<T>;
}

interface useDocHelperReturns {
  hasSaved: boolean;
}

export function useSaveDoc<T extends FieldValues>({
  hasSaved,
  formRef,
  submitRef,
  watch,
}: useDocHelperParams<T>): useDocHelperReturns {
  const router = useRouter();
  const initial = useRef(true);

  useEffect(() => {
    const warningText =
      "Do you want to leave the site? Changes you made is being saved...";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (hasSaved.current) return;
      e.preventDefault();
      return warningText;
    };
    const handleBrowseAway = () => {
      if (hasSaved.current) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [hasSaved, router.events]);

  const submitForm = useCallback(() => {
    hasSaved.current = false;

    console.log("Saving");

    formRef.current?.requestSubmit(submitRef.current);

    hasSaved.current = true;
  }, [formRef, hasSaved, submitRef]);

  const debouncedSave = debounce(() => {
    submitForm();
  }, 1000);

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        // Prevent the Save dialog to open
        e.preventDefault();
        debouncedSave();
      }
    };
    document.addEventListener("keydown", keyDownEvent);

    return () => document.removeEventListener("keydown", keyDownEvent);
  }, [debouncedSave]);

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      // name == undefined to disregard form reset() that updates the whole form
      if (name == undefined || name == "diffHash") return;
      if (initial.current) {
        initial.current = false;
        return;
      }

      hasSaved.current = false;
      // debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, hasSaved]);

  return { hasSaved: hasSaved.current };
}
