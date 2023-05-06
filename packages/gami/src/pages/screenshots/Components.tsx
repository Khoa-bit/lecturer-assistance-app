import Status from "../../components/documents/Status";
import {DocumentsStatusOptions} from "raito";

export function Components() {

  return (
    <div id="main" className="bg-white p-10">
      <Status screenshotMode={true} status={DocumentsStatusOptions.Todo}></Status>
      <Status screenshotMode={true} status={DocumentsStatusOptions["In progress"]}></Status>
      <Status screenshotMode={true} status={DocumentsStatusOptions.Review}></Status>
      <Status screenshotMode={true} status={DocumentsStatusOptions.Done}></Status>
      <Status screenshotMode={true} status={DocumentsStatusOptions.Closed}></Status>
    </div>
  );
}

export default Components;
