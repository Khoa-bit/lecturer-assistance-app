import { DocumentsStatusOptions } from "raito";

export enum StatusEventOptions {
  "Up next" = "Up next",
  Upcoming = "Upcoming",
  Late = "Late",
  "In progress" = "In progress",
  Review = "Review",
  Done = "Done",
  Closed = "Closed",
  Outdated = "Outdated",
}

export interface StatusProps {
  status: StatusEventOptions;
}

function StatusEvent({ status }: StatusProps) {
  switch (status) {
    case StatusEventOptions["Up next"]:
      return (
        <p className="w-fit rounded bg-yellow-100 px-2 py-1 font-semibold text-yellow-700">
          {status}
        </p>
      );
    case StatusEventOptions.Upcoming:
      return (
        <p className="w-fit rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700">
          {status}
        </p>
      );
    case StatusEventOptions.Late:
      return (
        <p className="w-fit rounded bg-red-100 px-2 py-1 font-semibold text-red-700">
          {status}
        </p>
      );
    case StatusEventOptions["In progress"]:
      return (
        <p className="w-fit rounded bg-amber-100 px-2 py-1 font-semibold text-amber-700">
          {status}
        </p>
      );
    case StatusEventOptions.Review:
      return (
        <p className="w-fit rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700">
          {status}
        </p>
      );
    case StatusEventOptions.Done:
      return (
        <p className="w-fit rounded bg-green-100 px-2 py-1 font-semibold text-green-700">
          {status}
        </p>
      );
    case StatusEventOptions.Closed:
      return (
        <p className="w-fit rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
          {status}
        </p>
      );
    case StatusEventOptions.Outdated:
      return (
        <p className="underline-yellow-500 w-fit rounded bg-stone-100 px-2 py-1 font-semibold text-stone-700 underline decoration-yellow-500 decoration-2">
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

export function eventStatus(
  status: DocumentsStatusOptions | undefined,
  eventDocumentStartTime: string | undefined,
  eventDocumentEndTime: string | undefined
): StatusEventOptions {
  if (!eventDocumentStartTime || !eventDocumentEndTime || !status)
    return status as unknown as StatusEventOptions;

  const startTime = new Date(eventDocumentStartTime);
  const endTime = new Date(eventDocumentEndTime);
  const now = new Date();

  if (
    now > endTime &&
    status != DocumentsStatusOptions.Done &&
    status != DocumentsStatusOptions.Closed
  ) {
    return StatusEventOptions.Outdated;
  }

  if (status != DocumentsStatusOptions.Todo)
    return status as unknown as StatusEventOptions;

  if (now > startTime) {
    return StatusEventOptions.Late;
  } else if (now.getDate() == startTime.getDate()) {
    return StatusEventOptions["Up next"];
  } else if (now < startTime) {
    return StatusEventOptions.Upcoming;
  } else {
    // Force the rest of the status to be StatusEventOptions
    return status as unknown as StatusEventOptions;
  }
}

export default StatusEvent;
