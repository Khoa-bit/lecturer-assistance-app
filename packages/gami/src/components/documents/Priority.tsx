import { DocumentsPriorityOptions } from "src/types/raito";
import HigherPrio from "../icons/HigherPrio";
import HighPrio from "../icons/HighPrio";
import LowerPrio from "../icons/LowerPrio";
import LowPrio from "../icons/LowPrio";
import MediumPrio from "../icons/MediumPrio";

interface PriorityProps extends React.SVGProps<SVGSVGElement> {
  priority: DocumentsPriorityOptions;
}

function Priority({ priority, ...props }: PriorityProps) {
  switch (priority) {
    case DocumentsPriorityOptions.Higher:
      return <HigherPrio {...props}></HigherPrio>;
    case DocumentsPriorityOptions.High:
      return <HighPrio {...props}></HighPrio>;
    case DocumentsPriorityOptions.Medium:
      return <MediumPrio {...props}></MediumPrio>;
    case DocumentsPriorityOptions.Low:
      return <LowPrio {...props}></LowPrio>;
    case DocumentsPriorityOptions.Lower:
      return <LowerPrio {...props}></LowerPrio>;
    default:
      return <MediumPrio {...props}></MediumPrio>;
  }
}

export default Priority;
