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
	Temp = "temp",
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
	priority: DocumentsPriorityOptions
	status: DocumentsStatusOptions
	richText?: null | TrichText
	diffHash?: string
	owner: RecordIdString
}

export type EventDocumentsRecord = {
	document: RecordIdString
	fullDocument?: RecordIdString
	startTime: IsoDateString
	endTime?: IsoDateString
	recurring?: boolean
}

export enum FullDocumentsCategoryOptions {
	"International journals - Rank 1" = "International journals - Rank 1",
	"International journals - Rank 2" = "International journals - Rank 2",
	"International journals - Other" = "International journals - Other",
	"National journals" = "National journals",
	"Monographs" = "Monographs",
	"Curriculums" = "Curriculums",
	"Reference books" = "Reference books",
	"Manual books" = "Manual books",
	"Draft" = "Draft",
}
export type FullDocumentsRecord = {
	document: RecordIdString
	category: FullDocumentsCategoryOptions
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

export type TempRecord = {
	name?: string
	person?: RecordIdString
}

export type UsersRecord = {
	person: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type AdvisorsResponse<Texpand = unknown> = AdvisorsRecord & BaseSystemFields<Texpand>
export type AttachmentsResponse<Texpand = unknown> = AttachmentsRecord & BaseSystemFields<Texpand>
export type ClassesResponse<Texpand = unknown> = ClassesRecord & BaseSystemFields<Texpand>
export type CourseTemplatesResponse = CourseTemplatesRecord & BaseSystemFields
export type CoursesResponse<Texpand = unknown> = CoursesRecord & BaseSystemFields<Texpand>
export type DepartmentsResponse<Texpand = unknown> = DepartmentsRecord & BaseSystemFields<Texpand>
export type DocumentsResponse<TrichText = unknown, Texpand = unknown> = DocumentsRecord<TrichText> & BaseSystemFields<Texpand>
export type EventDocumentsResponse<Texpand = unknown> = EventDocumentsRecord & BaseSystemFields<Texpand>
export type FullDocumentsResponse<Texpand = unknown> = FullDocumentsRecord & BaseSystemFields<Texpand>
export type LecturersResponse<Texpand = unknown> = LecturersRecord & BaseSystemFields<Texpand>
export type MajorsResponse = MajorsRecord & BaseSystemFields
export type ParticipantsResponse<Texpand = unknown> = ParticipantsRecord & BaseSystemFields<Texpand>
export type PeopleResponse<Texpand = unknown> = PeopleRecord & BaseSystemFields<Texpand>
export type RelationshipsResponse<Texpand = unknown> = RelationshipsRecord & BaseSystemFields<Texpand>
export type TempResponse<Texpand = unknown> = TempRecord & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = UsersRecord & AuthSystemFields<Texpand>

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
	temp: TempRecord
	users: UsersRecord
}