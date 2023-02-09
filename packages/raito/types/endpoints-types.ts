import { ParticipantsResponse } from './pocketbase-types';

export interface ContactsResponse extends ParticipantsResponse {
  expand: {
    document_id: string;
    document_name: string;
  };
}
