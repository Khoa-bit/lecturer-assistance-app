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

// From PB To send to input local-datetime
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

// From PB To send to input local-datetime
export function dateToISOLikeButLocal(dateTime: Date): string {
  const offsetMs = dateTime.getTimezoneOffset() * 60 * 1000;
  const msLocal = dateTime.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
}

// From input local-datetime To send to PB
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

// Format Date to a string format
// Ref: https://date-fns.org/v2.29.3/docs/format
export function formatDate(
  d: string | number | Date | null | undefined,
  dateTimeFormat: string
) {
  return d ? format(new Date(d), dateTimeFormat) : null;
}

// Format date time for input fields such as min, max, value, defaultValue
export function formatDateToInput(
  d: string | number | Date | null | undefined
) {
  return `${formatDate(d, "yyyy-MM-dd")}T${formatDate(d, "hh:mm")}`;
}

// Sort date time from past to future (ascending)
export function sortDate(a: Date, b: Date, desc?: boolean) {
  let result;
  if (a == b) {
    result = 0;
  } else if (a > b) {
    result = 1;
  } else {
    result = -1;
  }
  return desc ? -result : result;
}

export const getCurrentSemester = (): string => {
  const now = new Date(Date.now());
  const fullYear = now.getFullYear();
  const month = now.getMonth();

  if (month <= 7) {
    return `Semester _ ${fullYear - 1} - ${fullYear}`;
  } else {
    return `Semester _ ${fullYear} - ${fullYear + 1}`;
  }
};

export const getCurrentCohort = (): string => {
  const now = new Date(Date.now());
  const fullYear = now.getFullYear();
  const month = now.getMonth();

  if (month <= 7) {
    return `${fullYear - 1} - ${fullYear + 3}`;
  } else {
    return `${fullYear} - ${fullYear + 4}`;
  }
};

// Extensions category map to Material symbol
export enum FileExtensions {
  Image = "image",
  Video = "movie",
  Document = "article",
  Unknown = "attach_file",
}

export function categorizeFile(filename: string): {
  fileExtension: FileExtensions;
  color: string;
} {
  const ext: string = filename
    .substring(filename.lastIndexOf(".") + 1)
    .toLowerCase();

  const imageExtensions: string[] = [
    "bmp",
    "gif",
    "heic",
    "ico",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "tif",
    "webp",
  ];
  const videoExtensions: string[] = [
    "3gp",
    "avi",
    "flv",
    "m4v",
    "mkv",
    "mov",
    "mp4",
    "mpeg",
    "mpg",
    "ogg",
    "vob",
    "webm",
    "wmv",
  ];
  const documentExtensions: string[] = [
    "csv",
    "doc",
    "docx",
    "odp",
    "ods",
    "odt",
    "pdf",
    "ppt",
    "pptx",
    "rtf",
    "txt",
    "xls",
    "xlsx",
  ];

  if (imageExtensions.includes(ext)) {
    return { fileExtension: FileExtensions.Image, color: "text-rose-500" };
  } else if (videoExtensions.includes(ext)) {
    return { fileExtension: FileExtensions.Video, color: "text-red-500 " };
  } else if (documentExtensions.includes(ext)) {
    return { fileExtension: FileExtensions.Document, color: "text-blue-500 " };
  } else {
    return { fileExtension: FileExtensions.Unknown, color: "text-gray-500" };
  }
}
