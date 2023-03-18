import { useRouter } from "next/router";
import { useRef, useEffect, useCallback } from "react";
import type {
  FieldValues,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { debounce } from "src/lib/input_handling";

interface useDocHelperParams<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  submit: () => Promise<void>;
  watch: UseFormWatch<T>;
}

interface useDocHelperReturns {
  hasSaved: boolean;
}

export function useSaveDoc<T extends FieldValues>({
  trigger,
  submit,
  watch,
}: useDocHelperParams<T>): useDocHelperReturns {
  const router = useRouter();
  // const [hasSaved, setHasSaved] = useState(true);
  const initial = useRef(true);
  const hasSaved = useRef(true);

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

  const submitForm = useCallback(
    () =>
      // Validate the form before manual submitting
      trigger(undefined, { shouldFocus: false }).then((isValid) => {
        if (!isValid) return;
        hasSaved.current = false;

        console.log("Saving");

        submit().then(() => {
          hasSaved.current = true;
        });
      }),
    [submit, trigger]
  );
  const debouncedSave = debounce(() => submitForm(), 500);

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
      if (name == "diffHash") return;
      if (initial.current) {
        initial.current = false;
        return;
      }

      hasSaved.current = false;
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return { hasSaved: hasSaved.current };
}
