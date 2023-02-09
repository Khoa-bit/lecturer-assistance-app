import type PocketBase from "pocketbase";
import type { BaseQueryParams } from "pocketbase";
import type { ListResult } from "pocketbase";
import type { BaseSystemFields } from "raito";

export interface SimpleQueryParams extends BaseQueryParams {
  page?: number;
  perPage?: number;
}

export type APIGetList = typeof apiGetList;

/**
 * Returns paginated items list.
 */
export async function apiGetList<T = BaseSystemFields>(
  this: PocketBase,
  basePath: string,
  page = 1,
  perPage = 30,
  queryParams: SimpleQueryParams = {}
): Promise<ListResult<T>> {
  const responseData = await this.send(basePath, {
    method: "GET",
    params: { ...queryParams, page, perPage },
  });

  return responseData as ListResult<T>;
}
