import { DocumentsStatusOptions } from "raito";

interface StatusProps {
  status: DocumentsStatusOptions;
  screenshotMode?: boolean;
}

function Status({ status, screenshotMode }: StatusProps) {
  switch (status) {
    case DocumentsStatusOptions.Todo:
      return (
        <p
          className={`w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
    case DocumentsStatusOptions["In progress"]:
      return (
        <p
          className={`w-fit rounded bg-amber-100 px-2 py-1 font-semibold text-amber-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
    case DocumentsStatusOptions.Review:
      return (
        <p
          className={`w-fit rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
    case DocumentsStatusOptions.Done:
      return (
        <p
          className={`w-fit rounded bg-green-100 px-2 py-1 font-semibold text-green-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
    case DocumentsStatusOptions.Closed:
      return (
        <p
          className={`w-fit rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
    default:
      return (
        <p
          className={`w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700 ${
            screenshotMode && "px-4 py-2 text-2xl"
          }`}
        >
          {status}
        </p>
      );
  }
}

export function getStatusFileName(
  status: DocumentsStatusOptions | string
): string {
  return `Status${status.replaceAll(" ", "")}.png`;
}

export default Status;
