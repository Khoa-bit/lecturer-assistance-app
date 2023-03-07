import { format } from "date-fns";

// https://stackoverflow.com/questions/24004791/what-is-the-debounce-function-in-javascript
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function executedFunction(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = function (): void {
      timeout = undefined;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function dateToISOLikeButLocalOrUndefined(
  dateTimeStr: string | undefined
): string | undefined {
  if (dateTimeStr == undefined || dateTimeStr.length == 0) return undefined;
  try {
    return dateToISOLikeButLocal(new Date(dateTimeStr));
  } catch (_) {
    return undefined;
  }
}

export function dateToISOLikeButLocal(dateTime: Date): string {
  const offsetMs = dateTime.getTimezoneOffset() * 60 * 1000;
  const msLocal = dateTime.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
}

export function dateToISOOrUndefined(
  dateTimeStr: string | undefined
): string | undefined {
  if (dateTimeStr == undefined || dateTimeStr.length == 0) return undefined;
  try {
    return new Date(dateTimeStr).toISOString();
  } catch (_) {
    return undefined;
  }
}

export function formatDate(
  d: string | number | Date | null | undefined,
  dateTimeFormat: string
) {
  return d ? format(new Date(d), dateTimeFormat) : null;
}
