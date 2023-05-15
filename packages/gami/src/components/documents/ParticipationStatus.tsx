import { ParticipantsStatusOptions } from "raito";
import { IcRoundCheck } from "../icons/IcRoundCheck";
import { IcRoundClose } from "../icons/IcRoundClose";
import { IcRoundQuestionMark } from "../icons/IcRoundQuestionMark";

interface ParticipationStatusProps {
  status?: ParticipantsStatusOptions;
  className?: string;
}

export function ParticipationStatus({
  status,
  className,
}: ParticipationStatusProps) {
  switch (status) {
    case ParticipantsStatusOptions.Yes:
      return (
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border border-white bg-green-100 p-[0.1rem] text-green-700 ${className}`}
        >
          <IcRoundCheck></IcRoundCheck>
        </div>
      );
    case ParticipantsStatusOptions.No:
      return (
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-100 p-[0.1rem] text-red-700 ${className}`}
        >
          <IcRoundClose></IcRoundClose>
        </div>
      );
    case ParticipantsStatusOptions.Maybe:
      return (
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border border-white bg-slate-100 p-[0.1rem] text-slate-700 ${className}`}
        >
          <IcRoundQuestionMark></IcRoundQuestionMark>
        </div>
      );
    default:
      return <></>;
  }
}
