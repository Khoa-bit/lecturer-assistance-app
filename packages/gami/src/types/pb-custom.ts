import type { APIGetList } from "src/lib/pb_crud";
import type PocketBase from "pocketbase";

export interface PBCustom extends PocketBase {
  apiGetList: APIGetList;
}
