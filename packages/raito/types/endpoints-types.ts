import { PeopleResponse } from './pocketbase-types';

export interface ContactsResponse extends PeopleResponse {
  expand: {
    documents_id_list: string;
    documents_name_list: string;
  };
}
