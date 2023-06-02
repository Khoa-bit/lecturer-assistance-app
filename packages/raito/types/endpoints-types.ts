import {
  AcademicMaterialsResponse,
  ClassesResponse,
  CoursesResponse,
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
  PeopleResponse,
  PersonalNotesResponse,
  RelationshipsResponse,
} from './pocketbase-types';

// GetEventDocuments, GetParticipatedEventDocuments are missing CustomResponse types

// GetUpcomingEvents, GetPastEvents
export interface EventDocumentsCustomResponse extends EventDocumentsResponse {
  expand: {
    document_attachmentsHash: string;
    document_created: string;
    document_deleted: string;
    document_description: string;
    document_diffHash: string;
    document_endTime: string;
    document_id: string;
    document_name: string;
    document_owner: string;
    document_priority: string;
    document_richText: string;
    document_startTime: string;
    document_status: string;
    document_thumbnail: string;
    document_updated: string;
    fullDocument_created: string;
    fullDocument_document: string;
    fullDocument_id: string;
    fullDocument_internal: string;
    fullDocument_updated: string;
    participant_created: string;
    participant_document: string;
    participant_id: string;
    participant_note: string;
    participant_permission: string;
    participant_person: string;
    participant_role: string;
    participant_status: string;
    participant_updated: string;
  };
}

// GetFullDocuments, GetParticipatedFullDocuments, GetHasWriteFullDocuments
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
    userDocument_startTime: string;
    userDocument_endTime: string;
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
    participant_status: string;
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
    userDocument_startTime: string;
    userDocument_endTime: string;
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
    userDocument_startTime: string;
    userDocument_endTime: string;
  };
}

// GetAcademicMaterialsWithParticipants
export interface AcademicMaterialsGroupCustomResponse
  extends DocumentsResponse {
  expand: {
    academicMaterial_category_list: string[];
    academicMaterial_created_list: string[];
    academicMaterial_fullDocument_list: string[];
    academicMaterial_id_list: string[];
    academicMaterial_updated_list: string[];
    person_avatar_list: string[];
    person_contactLocation_list: string[];
    person_contactRoom_list: string[];
    person_created_list: string[];
    person_deleted_list: string[];
    person_education_list: string[];
    person_experience_list: string[];
    person_gender_list: string[];
    person_id_list: string[];
    person_interests_list: string[];
    person_isFaculty_list: string[];
    person_major_list: string[];
    person_name_list: string[];
    person_personId_list: string[];
    person_personalEmail_list: string[];
    person_phone_list: string[];
    person_placeOfBirth_list: string[];
    person_thumbnail_list: string[];
    person_title_list: string[];
    person_updated_list: string[];
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
    userDocument_startTime: string;
    userDocument_endTime: string;
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
    userDocument_startTime: string;
    userDocument_endTime: string;
  };
}

// GetCourses, GetParticipatedCourses
export interface CoursesCustomResponse extends CoursesResponse {
  expand: {
    courseTemplate_academicProgram: string;
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
    userDocument_startTime: string;
    userDocument_endTime: string;
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
    major_created: string;
    major_department: string;
    major_id: string;
    major_name: string;
    major_updated: string;
    department_created: string;
    department_id: string;
    department_name: string;
    department_updated: string;
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
    major_created: string;
    major_department: string;
    major_id: string;
    major_name: string;
    major_updated: string;
    department_created: string;
    department_id: string;
    department_name: string;
    department_updated: string;
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
    participant_status: string;
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

// ParticipantsXlsxImport
export interface ParticipantsXlsxImportResponse {
  ID: string;
  No: number;
  StudentID: string;
  LastName: string;
  FirstName: string;
  DOB: string;
  Gender: string;
  MajorID: string;
  Major: string;
  DepartmentID: string;
  Class: string;
  Exists: boolean;
}
