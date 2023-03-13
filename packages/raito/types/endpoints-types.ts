import {
  EventDocumentsResponse,
  FullDocumentsResponse,
  RelationshipsResponse,
} from './pocketbase-types';

export interface RelationshipsCustomResponse extends RelationshipsResponse {
  expand: {
    fromUser_created: string;
    fromUser_id: string;
    fromUser_person: string;
    fromUser_updated: string;
    toPerson_avatar: string;
    toPerson_created: string;
    toPerson_deleted: string;
    toPerson_department: string;
    toPerson_gender: string;
    toPerson_id: string;
    toPerson_name: string;
    toPerson_personId: string;
    toPerson_personalEmail: string;
    toPerson_phone: string;
    toPerson_placeOfBirth: string;
    toPerson_title: string;
    toPerson_updated: string;
    toUser_created: string;
    toUser_id: string;
    toUser_person: string;
    toUser_updated: string;
  };
}

export interface EventDocumentsCustomResponse extends EventDocumentsResponse {
  expand: {
    userDocument_id: string;
    userDocument_name: string;
    userDocument_thumbnail: string;
    userDocument_priority: string;
    userDocument_status: string;
    userDocument_richText: string;
    userDocument_diffHash: string;
    userDocument_owner: string;
  };
}

export interface FullDocumentsCustomResponse extends FullDocumentsResponse {
  expand: {
    userDocument_id: string;
    userDocument_name: string;
    userDocument_thumbnail: string;
    userDocument_priority: string;
    userDocument_status: string;
    userDocument_richText: string;
    userDocument_diffHash: string;
    userDocument_owner: string;
  };
}
