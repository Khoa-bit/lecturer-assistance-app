import { useRouter } from "next/router";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";
import { debounce } from "src/lib/input_handling";

interface useDocHelperParams<T extends FieldValues> {
  formRef: RefObject<HTMLFormElement>;
  submitRef: RefObject<HTMLInputElement>;
  watch: UseFormWatch<T>;
}

export function useSaveDoc<T extends FieldValues>({
  formRef,
  submitRef,
  watch,
}: useDocHelperParams<T>): boolean {
  const router = useRouter();
  const initial = useRef(true);
  const [hasSaved, setHasSaved] = useState(true);

  const submitForm = useCallback(() => {
    setHasSaved(false);

    formRef.current?.requestSubmit(submitRef.current);

    setHasSaved(true);
  }, [formRef, setHasSaved, submitRef]);

  useEffect(() => {
    const handleBrowseAway = () => {
      if (hasSaved) return;
      submitForm();
      return;
    };

    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [hasSaved, router.events, submitForm]);

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s" && !hasSaved) {
        // Prevent the Save dialog to open
        e.preventDefault();
        submitForm();
      }
    };
    document.addEventListener("keydown", keyDownEvent);

    return () => document.removeEventListener("keydown", keyDownEvent);
  }, [hasSaved, submitForm]);

  useEffect(() => {
    const debouncedSave = debounce(() => {
      submitForm();
    }, 1000);

    const subscription = watch((data, { name }) => {
      // name == undefined to disregard form reset() that updates the whole form
      if (name == undefined || name == "diffHash") return;
      if (initial.current) {
        initial.current = false;
        return;
      }

      setHasSaved(false);
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, setHasSaved, submitForm]);

  const onSubmitClick = () => {
    setHasSaved(true);
  };

  useEffect(() => {
    const submitHtml = submitRef.current;
    submitHtml?.addEventListener("click", onSubmitClick);

    return () => submitHtml?.removeEventListener("click", onSubmitClick);
  }, [submitRef]);

  return hasSaved;
}
