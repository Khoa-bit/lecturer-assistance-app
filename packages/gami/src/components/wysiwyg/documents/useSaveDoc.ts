import { useRouter } from "next/router";
import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import type {
  FieldValues,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { debounce } from "src/lib/input_handling";

interface useDocHelperParams<T extends FieldValues> {
  formRef: RefObject<HTMLFormElement>;
  submitRef: RefObject<HTMLInputElement>;
  watch: UseFormWatch<T>;
  trigger: UseFormTrigger<T>;
}

export function useSaveDoc<T extends FieldValues>({
  formRef,
  submitRef,
  watch,
  trigger,
}: useDocHelperParams<T>): boolean {
  const router = useRouter();
  const [hasSaved, setHasSaved] = useState(true);

  const submitForm = useCallback(
    async (shouldFocus = false) => {
      setHasSaved(false);
      if (!(await trigger(undefined, { shouldFocus }))) return;

      formRef.current?.requestSubmit(submitRef.current);

      setHasSaved(true);
    },
    [formRef, submitRef, trigger]
  );

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (hasSaved) return;
      e.preventDefault();
      submitForm();
      return;
    };

    const handleBrowseAway = () => {
      if (hasSaved) return;
      submitForm();
      return;
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [formRef, hasSaved, router.events, submitForm, submitRef]);

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s" && !hasSaved) {
        // Prevent the Save dialog to open
        e.preventDefault();
        submitForm(true);
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

      setHasSaved(false);
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, setHasSaved, submitForm]);

  return hasSaved;
}
