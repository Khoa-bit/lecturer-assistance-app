/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Advisors = "advisors",
	Attachments = "attachments",
	Classes = "classes",
	CourseTemplates = "courseTemplates",
	Courses = "courses",
	Departments = "departments",
	Documents = "documents",
	EventDocuments = "eventDocuments",
	FullDocuments = "fullDocuments",
	Lecturers = "lecturers",
	Majors = "majors",
	Participants = "participants",
	People = "people",
	Relationships = "relationships",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string

// System fields
export type BaseSystemFields = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: { [key: string]: any }
}

export type AuthSystemFields = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields

// Record types for each collection

export type AdvisorsRecord = {
	person: RecordIdString
}

export type AttachmentsRecord = {
	file: string
	document: RecordIdString
}

export enum ClassesTrainingSystemOptions {
	"Undergraduate" = "Undergraduate",
}
export type ClassesRecord = {
	classId?: string
	advisor: RecordIdString
	cohort: string
	department: RecordIdString
	trainingSystem: ClassesTrainingSystemOptions
	document: RecordIdString
}

export type CourseTemplatesRecord = {
	courseId?: string
	name: string
	periodsCount: number
}

export type CoursesRecord = {
	courseTemplate: RecordIdString
	lecturer: RecordIdString
	semester: string
	document: RecordIdString
}

export type DepartmentsRecord = {
	name: string
	major: RecordIdString
}

export enum DocumentsCategoryOptions {
	"International journals - Rank 1" = "International journals - Rank 1",
	"International journals - Rank 2" = "International journals - Rank 2",
	"International journals - Other" = "International journals - Other",
	"National journals" = "National journals",
	"Monographs" = "Monographs",
	"Curriculums" = "Curriculums",
	"Reference books" = "Reference books",
	"Manual books" = "Manual books",
	"Personal notes" = "Personal notes",
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
export type DocumentsRecord<TrichText = unknown> = {
	name: string
	thumbnail?: string
	category?: DocumentsCategoryOptions
	priority: DocumentsPriorityOptions
	status: DocumentsStatusOptions
	richText?: null | TrichText
}

export type EventDocumentsRecord = {
	document: RecordIdString
	fullDocument?: RecordIdString
	startTime: IsoDateString
	endTime?: IsoDateString
	recurring?: boolean
}

export type FullDocumentsRecord = {
	document: RecordIdString
}

export type LecturersRecord = {
	person: RecordIdString
}

export type MajorsRecord = {
	name: string
}

export enum ParticipantsPermissionOptions {
	"read" = "read",
	"comment" = "comment",
	"write" = "write",
}
export type ParticipantsRecord = {
	permission: ParticipantsPermissionOptions
	owner?: boolean
	role?: string
	note?: string
	document: RecordIdString
	person: RecordIdString
}

export enum PeopleGenderOptions {
	"Man" = "Man",
	"Woman" = "Woman",
	"Non-Binary" = "Non-Binary",
	"Not Listed" = "Not Listed",
}
export type PeopleRecord = {
	personId?: string
	name: string
	avatar?: string
	phone?: string
	personalEmail?: string
	title: string
	placeOfBirth?: string
	gender?: PeopleGenderOptions
	department?: RecordIdString
	deleted?: IsoDateString
}

export type RelationshipsRecord = {
	fromPerson: RecordIdString
	toPerson: RecordIdString
}

export type UsersRecord = {
	person: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type AdvisorsResponse = AdvisorsRecord & BaseSystemFields
export type AttachmentsResponse = AttachmentsRecord & BaseSystemFields
export type ClassesResponse = ClassesRecord & BaseSystemFields
export type CourseTemplatesResponse = CourseTemplatesRecord & BaseSystemFields
export type CoursesResponse = CoursesRecord & BaseSystemFields
export type DepartmentsResponse = DepartmentsRecord & BaseSystemFields
export type DocumentsResponse<TrichText = unknown> = DocumentsRecord<TrichText> & BaseSystemFields
export type EventDocumentsResponse = EventDocumentsRecord & BaseSystemFields
export type FullDocumentsResponse = FullDocumentsRecord & BaseSystemFields
export type LecturersResponse = LecturersRecord & BaseSystemFields
export type MajorsResponse = MajorsRecord & BaseSystemFields
export type ParticipantsResponse = ParticipantsRecord & BaseSystemFields
export type PeopleResponse = PeopleRecord & BaseSystemFields
export type RelationshipsResponse = RelationshipsRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	advisors: AdvisorsRecord
	attachments: AttachmentsRecord
	classes: ClassesRecord
	courseTemplates: CourseTemplatesRecord
	courses: CoursesRecord
	departments: DepartmentsRecord
	documents: DocumentsRecord
	eventDocuments: EventDocumentsRecord
	fullDocuments: FullDocumentsRecord
	lecturers: LecturersRecord
	majors: MajorsRecord
	participants: ParticipantsRecord
	people: PeopleRecord
	relationships: RelationshipsRecord
	users: UsersRecord
}