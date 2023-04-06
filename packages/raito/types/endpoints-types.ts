import {
  AcademicMaterialsResponse,
  ClassesResponse,
  CoursesResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
  PeopleResponse,
  PersonalNotesResponse,
  RelationshipsResponse,
} from './pocketbase-types';

// GetEventDocuments, GetParticipatedEventDocuments
export interface EventDocumentsCustomResponse extends EventDocumentsResponse {
  expand: {
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetFullDocuments, GetParticipatedFullDocuments
export interface FullDocumentsCustomResponse extends FullDocumentsResponse {
  expand: {
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetSharedDocuments
export interface SharedDocumentsCustomResponse extends FullDocumentsResponse {
  expand: {
    participant_created: string;
    participant_document: string;
    participant_id: string;
    participant_note: string;
    participant_permission: string;
    participant_person: string;
    participant_role: string;
    participant_updated: string;
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetAcademicMaterials, GetParticipatedAcademicMaterials
export interface AcademicMaterialsCustomResponse
  extends AcademicMaterialsResponse {
  expand: {
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetPersonalNotes, GetParticipatedPersonalNotes
export interface PersonalNotesCustomResponse extends PersonalNotesResponse {
  expand: {
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetClasses, GetParticipatedClasses
export interface ClassesCustomResponse extends ClassesResponse {
  expand: {
    major_created: string;
    major_department: string;
    major_id: string;
    major_name: string;
    major_updated: string;
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetCourses, GetParticipatedCourses
export interface CoursesCustomResponse extends CoursesResponse {
  expand: {
    courseTemplate_courseId: string;
    courseTemplate_created: string;
    courseTemplate_id: string;
    courseTemplate_name: string;
    courseTemplate_periodsCount: string;
    courseTemplate_updated: string;
    userDocument_attachmentsHash: string;
    userDocument_created: string;
    userDocument_deleted: string;
    userDocument_diffHash: string;
    userDocument_id: string;
    userDocument_name: string;
    userDocument_owner: string;
    userDocument_priority: string;
    userDocument_richText: string;
    userDocument_status: string;
    userDocument_thumbnail: string;
    userDocument_updated: string;
  };
}

// GetContacts
export interface ContactsCustomResponse extends PeopleResponse {
  expand: {
    user_created: string;
    user_email: string;
    user_id: string;
    user_person: string;
    user_updated: string;
  };
}

// GetStarredContacts
export interface StarredContactsCustomResponse extends ContactsCustomResponse {
  expand: {
    relationship_created: string;
    relationship_fromPerson: string;
    relationship_id: string;
    relationship_toPerson: string;
    relationship_updated: string;
    user_created: string;
    user_email: string;
    user_id: string;
    user_person: string;
    user_updated: string;
  };
}

// GetAllDocParticipants
export interface ParticipantsCustomResponse extends PeopleResponse {
  expand: {
    participant_created: string;
    participant_document: string;
    participant_id: string;
    participant_note: string;
    participant_permission: string;
    participant_person: string;
    participant_role: string;
    participant_updated: string;
    user_created: string;
    user_email: string;
    user_id: string;
    user_person: string;
    user_updated: string;
  };
}

// Deprecated since We don't need to add contact manually anymore - add star will automatically add new relationships
// GetRelationships, GetNewRelationshipsOptions
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
