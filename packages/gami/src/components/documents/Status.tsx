import { DocumentsStatusOptions } from "raito";

interface StatusProps {
  status: DocumentsStatusOptions;
}

function Status({ status }: StatusProps) {
  switch (status) {
    case DocumentsStatusOptions.Todo:
      return (
        <p className="w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
          {status}
        </p>
      );
    case DocumentsStatusOptions["In progress"]:
      return (
        <p className="w-fit rounded bg-amber-100 px-2 py-1 font-semibold text-amber-700">
          {status}
        </p>
      );
    case DocumentsStatusOptions.Review:
      return (
        <p className="w-fit rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700">
          {status}
        </p>
      );
    case DocumentsStatusOptions.Done:
      return (
        <p className="w-fit rounded bg-green-100 px-2 py-1 font-semibold text-green-700">
          {status}
        </p>
      );
    case DocumentsStatusOptions.Closed:
      return (
        <p className="w-fit rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
          {status}
        </p>
      );
    default:
      return (
        <p className="w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
          {status}
        </p>
      );
  }
}

export default Status;
