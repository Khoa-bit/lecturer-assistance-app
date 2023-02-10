import { PeopleResponse } from './pocketbase-types';

export interface ContactsResponse extends PeopleResponse {
  expand: {
    document_id_list: string;
    document_name_list: string;
  };
}
