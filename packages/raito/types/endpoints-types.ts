import {
  EventDocumentsResponse,
  FullDocumentsResponse,
  PeopleResponse,
} from './pocketbase-types';

export interface ContactsCustomResponse extends PeopleResponse {
  expand: {
    documents_id_list: string;
    documents_name_list: string;
    documents_thumbnail_list: string;
    documents_priority_list: string;
    documents_status_list: string;
    documents_richText_list: string;
    documents_diffHash_list: string;
    documents_owner_list: string;
  };
}

export interface EventDocumentsCustomResponse extends EventDocumentsResponse {
  expand: {
    documents_id: string;
    documents_name: string;
    documents_thumbnail: string;
    documents_priority: string;
    documents_status: string;
    documents_richText: string;
    documents_diffHash: string;
    documents_owner: string;
  };
}

export interface FullDocumentsCustomResponse extends FullDocumentsResponse {
  expand: {
    documents_id: string;
    documents_name: string;
    documents_thumbnail: string;
    documents_priority: string;
    documents_status: string;
    documents_richText: string;
    documents_diffHash: string;
    documents_owner: string;
  };
}
