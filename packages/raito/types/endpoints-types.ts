import {
  ClassesResponse,
  CoursesResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
  PeopleResponse,
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

export interface ClassesCustomResponse extends ClassesResponse {
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

export interface CoursesCustomResponse extends CoursesResponse {
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

export interface ParticipantsCustomResponse extends PeopleResponse {
  expand: {
    eventDocument_created_list: string[];
    eventDocument_document_list: string[];
    eventDocument_endTime_list: string[];
    eventDocument_fullDocument_list: string[];
    eventDocument_id_list: string[];
    eventDocument_recurring_list: string[];
    eventDocument_startTime_list: string[];
    eventDocument_updated_list: string[];
    fullDocument_category_list: string[];
    fullDocument_created_list: string[];
    fullDocument_document_list: string[];
    fullDocument_id_list: string[];
    fullDocument_updated_list: string[];
    participant_created_list: string[];
    participant_document_list: string[];
    participant_id_list: string[];
    participant_note_list: string[];
    participant_permission_list: string[];
    participant_person_list: string[];
    participant_role_list: string[];
    participant_updated_list: string[];
    relationship_created_list: string[];
    relationship_fromPerson_list: string[];
    relationship_id_list: string[];
    relationship_toPerson_list: string[];
    relationship_updated_list: string[];
    userDocument_created_list: string[];
    userDocument_diffHash_list: string[];
    userDocument_id_list: string[];
    userDocument_name_list: string[];
    userDocument_owner_list: string[];
    userDocument_priority_list: string[];
    userDocument_richText_list: string[];
    userDocument_status_list: string[];
    userDocument_thumbnail_list: string[];
    userDocument_updated_list: string[];
  };
}
