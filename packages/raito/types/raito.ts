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
/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	AcademicMaterials = "academicMaterials",
	Attachments = "attachments",
	Classes = "classes",
	CourseTemplates = "courseTemplates",
	Courses = "courses",
	Departments = "departments",
	Documents = "documents",
	EventDocuments = "eventDocuments",
	FullDocuments = "fullDocuments",
	Majors = "majors",
	Participants = "participants",
	People = "people",
	PersonalNotes = "personalNotes",
	Relationships = "relationships",
	Reminders = "reminders",
	Services = "services",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum AcademicMaterialsCategoryOptions {
	"International journals - Rank 1" = "International journals - Rank 1",
	"International journals - Rank 2" = "International journals - Rank 2",
	"International journals - Other" = "International journals - Other",
	"National journals" = "National journals",
	"Conference" = "Conference",
	"Monographs" = "Monographs",
	"Curriculums" = "Curriculums",
	"Reference books" = "Reference books",
	"Manual books" = "Manual books",
	"Draft" = "Draft",
}
export type AcademicMaterialsRecord = {
	category: AcademicMaterialsCategoryOptions
	fullDocument: RecordIdString
}

export type AttachmentsRecord = {
	file: string
	document: RecordIdString
}

export enum ClassesAcademicProgramOptions {
	"Undergraduate" = "Undergraduate",
	"Graduate" = "Graduate",
}
export type ClassesRecord = {
	classId?: string
	cohort: string
	major: RecordIdString
	academicProgram: ClassesAcademicProgramOptions
	fullDocument: RecordIdString
}

export enum CourseTemplatesAcademicProgramOptions {
	"Undergradute" = "Undergradute",
	"Graduate" = "Graduate",
}
export type CourseTemplatesRecord = {
	courseId?: string
	name: string
	periodsCount: number
	academicProgram: CourseTemplatesAcademicProgramOptions
}

export type CoursesRecord = {
	courseTemplate?: RecordIdString
	semester: string
	fullDocument: RecordIdString
}

export type DepartmentsRecord = {
	departmentId: string
	name: string
}

export enum DocumentsPriorityOptions {
	"Lower" = "Lower",
	"Low" = "Low",
	"Medium" = "Medium",
	"High" = "High",
	"Higher" = "Higher",
}

export enum DocumentsStatusOptions {
	"Todo" = "Todo",
	"In progress" = "In progress",
	"Review" = "Review",
	"Done" = "Done",
	"Closed" = "Closed",
}
export type DocumentsRecord = {
	name: string
	thumbnail?: string
	priority: DocumentsPriorityOptions
	status: DocumentsStatusOptions
	diffHash?: string
	owner: RecordIdString
	deleted?: IsoDateString
	richText?: string
	attachmentsHash?: string
	startTime?: IsoDateString
	endTime?: IsoDateString
	description?: string
}

export enum EventDocumentsRecurringOptions {
	"Once" = "Once",
	"Daily" = "Daily",
	"Weekly" = "Weekly",
	"Monthly" = "Monthly",
	"Annually" = "Annually",
}
export type EventDocumentsRecord = {
	fullDocument: RecordIdString
	recurring: EventDocumentsRecurringOptions
	toFullDocument?: RecordIdString
	reminderAt?: IsoDateString
}

export enum FullDocumentsInternalOptions {
	"Academic material" = "Academic material",
	"Course" = "Course",
	"Class" = "Class",
	"Personal note" = "Personal note",
	"Event" = "Event",
}
export type FullDocumentsRecord = {
	document: RecordIdString
	internal: FullDocumentsInternalOptions
}

export type MajorsRecord = {
	majorId: string
	name?: string
	department: RecordIdString
}

export enum ParticipantsPermissionOptions {
	"read" = "read",
	"comment" = "comment",
	"write" = "write",
}

export enum ParticipantsStatusOptions {
	"Yes" = "Yes",
	"No" = "No",
	"Maybe" = "Maybe",
}
export type ParticipantsRecord = {
	permission: ParticipantsPermissionOptions
	role?: string
	note?: string
	document: RecordIdString
	person: RecordIdString
	status?: ParticipantsStatusOptions
}

export enum PeopleGenderOptions {
	"Male" = "Male",
	"Female" = "Female",
	"Non-Binary" = "Non-Binary",
	"Not Listed" = "Not Listed",
}
export type PeopleRecord<Teducation = unknown, Texperience = unknown, Tinterests = unknown> = {
	personId?: string
	name?: string
	avatar?: string
	phone?: string
	personalEmail?: string
	title?: string
	dayOfBirth?: IsoDateString
	placeOfBirth?: string
	gender?: PeopleGenderOptions
	major?: RecordIdString
	deleted?: IsoDateString
	thumbnail?: string
	interests?: null | Tinterests
	contactRoom?: string
	contactLocation?: string
	experience?: null | Texperience
	education?: null | Teducation
	isFaculty?: boolean
	hasAccount?: boolean
}

export type PersonalNotesRecord = {
	fullDocument: RecordIdString
}

export type RelationshipsRecord = {
	fromPerson: RecordIdString
	toPerson: RecordIdString
}

export enum RemindersFulldocumentInternalOptions {
	"Academic material" = "Academic material",
	"Course" = "Course",
	"Class" = "Class",
	"Personal note" = "Personal note",
	"Event" = "Event",
}

export enum RemindersFulldocumentDocumentPriorityOptions {
	"Lower" = "Lower",
	"Low" = "Low",
	"Medium" = "Medium",
	"High" = "High",
	"Higher" = "Higher",
}

export enum RemindersFulldocumentDocumentStatusOptions {
	"Todo" = "Todo",
	"In progress" = "In progress",
	"Review" = "Review",
	"Done" = "Done",
	"Closed" = "Closed",
}

export enum RemindersTofulldocumentInternalOptions {
	"Academic material" = "Academic material",
	"Course" = "Course",
	"Class" = "Class",
	"Personal note" = "Personal note",
	"Event" = "Event",
}

export enum RemindersTofulldocumentDocumentPriorityOptions {
	"Lower" = "Lower",
	"Low" = "Low",
	"Medium" = "Medium",
	"High" = "High",
	"Higher" = "Higher",
}

export enum RemindersTofulldocumentDocumentStatusOptions {
	"Todo" = "Todo",
	"In progress" = "In progress",
	"Review" = "Review",
	"Done" = "Done",
	"Closed" = "Closed",
}
export type RemindersRecord<TallParticipantsEmails = unknown> = {
	reminderAt?: IsoDateString
	fullDocument_id?: RecordIdString
	fullDocument_internal: RemindersFulldocumentInternalOptions
	fullDocument_document_name: string
	fullDocument_document_priority: RemindersFulldocumentDocumentPriorityOptions
	fullDocument_document_status: RemindersFulldocumentDocumentStatusOptions
	fullDocument_document_startTime?: IsoDateString
	fullDocument_document_endTime?: IsoDateString
	fullDocument_document_description?: string
	fullDocument_document_owner_name?: string
	toFullDocument_id?: RecordIdString
	toFullDocument_internal: RemindersTofulldocumentInternalOptions
	toFullDocument_document_name: string
	toFullDocument_document_priority: RemindersTofulldocumentDocumentPriorityOptions
	toFullDocument_document_status: RemindersTofulldocumentDocumentStatusOptions
	toFullDocument_document_startTime?: IsoDateString
	toFullDocument_document_endTime?: IsoDateString
	toFullDocument_document_description?: string
	toFullDocument_document_owner_name?: string
	allParticipantsEmails?: null | TallParticipantsEmails
}

export type ServicesRecord = never

export type UsersRecord = {
	person: RecordIdString
	justRegistered?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AcademicMaterialsResponse<Texpand = unknown> = Required<AcademicMaterialsRecord> & BaseSystemFields<Texpand>
export type AttachmentsResponse<Texpand = unknown> = Required<AttachmentsRecord> & BaseSystemFields<Texpand>
export type ClassesResponse<Texpand = unknown> = Required<ClassesRecord> & BaseSystemFields<Texpand>
export type CourseTemplatesResponse = Required<CourseTemplatesRecord> & BaseSystemFields
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type DepartmentsResponse = Required<DepartmentsRecord> & BaseSystemFields
export type DocumentsResponse<Texpand = unknown> = Required<DocumentsRecord> & BaseSystemFields<Texpand>
export type EventDocumentsResponse<Texpand = unknown> = Required<EventDocumentsRecord> & BaseSystemFields<Texpand>
export type FullDocumentsResponse<Texpand = unknown> = Required<FullDocumentsRecord> & BaseSystemFields<Texpand>
export type MajorsResponse<Texpand = unknown> = Required<MajorsRecord> & BaseSystemFields<Texpand>
export type ParticipantsResponse<Texpand = unknown> = Required<ParticipantsRecord> & BaseSystemFields<Texpand>
export type PeopleResponse<Teducation = unknown, Texperience = unknown, Tinterests = unknown, Texpand = unknown> = Required<PeopleRecord<Teducation, Texperience, Tinterests>> & BaseSystemFields<Texpand>
export type PersonalNotesResponse<Texpand = unknown> = Required<PersonalNotesRecord> & BaseSystemFields<Texpand>
export type RelationshipsResponse<Texpand = unknown> = Required<RelationshipsRecord> & BaseSystemFields<Texpand>
export type RemindersResponse<TallParticipantsEmails = unknown, Texpand = unknown> = Required<RemindersRecord<TallParticipantsEmails>> & BaseSystemFields<Texpand>
export type ServicesResponse = Required<ServicesRecord> & AuthSystemFields
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	academicMaterials: AcademicMaterialsRecord
	attachments: AttachmentsRecord
	classes: ClassesRecord
	courseTemplates: CourseTemplatesRecord
	courses: CoursesRecord
	departments: DepartmentsRecord
	documents: DocumentsRecord
	eventDocuments: EventDocumentsRecord
	fullDocuments: FullDocumentsRecord
	majors: MajorsRecord
	participants: ParticipantsRecord
	people: PeopleRecord
	personalNotes: PersonalNotesRecord
	relationships: RelationshipsRecord
	reminders: RemindersRecord
	services: ServicesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	academicMaterials: AcademicMaterialsResponse
	attachments: AttachmentsResponse
	classes: ClassesResponse
	courseTemplates: CourseTemplatesResponse
	courses: CoursesResponse
	departments: DepartmentsResponse
	documents: DocumentsResponse
	eventDocuments: EventDocumentsResponse
	fullDocuments: FullDocumentsResponse
	majors: MajorsResponse
	participants: ParticipantsResponse
	people: PeopleResponse
	personalNotes: PersonalNotesResponse
	relationships: RelationshipsResponse
	reminders: RemindersResponse
	services: ServicesResponse
	users: UsersResponse
}