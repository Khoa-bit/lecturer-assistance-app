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
	name: string
	department: RecordIdString
}

export enum ParticipantsPermissionOptions {
	"read" = "read",
	"comment" = "comment",
	"write" = "write",
}
export type ParticipantsRecord = {
	permission: ParticipantsPermissionOptions
	role?: string
	note?: string
	document: RecordIdString
	person: RecordIdString
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