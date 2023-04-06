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

export type CourseTemplatesRecord = {
	courseId?: string
	name: string
	periodsCount: number
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
	startTime?: IsoDateString
	endTime?: IsoDateString
	recurring: EventDocumentsRecurringOptions
	toFullDocument?: RecordIdString
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
export type PeopleRecord = {
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
	isAdvisor?: boolean
	isLecturer?: boolean
	thumbnail?: string
}

export type PersonalNotesRecord = {
	fullDocument: RecordIdString
}

export type RelationshipsRecord = {
	fromPerson: RecordIdString
	toPerson: RecordIdString
}

export type UsersRecord = {
	person: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type AcademicMaterialsResponse<Texpand = unknown> = AcademicMaterialsRecord & BaseSystemFields<Texpand>
export type AttachmentsResponse<Texpand = unknown> = AttachmentsRecord & BaseSystemFields<Texpand>
export type ClassesResponse<Texpand = unknown> = ClassesRecord & BaseSystemFields<Texpand>
export type CourseTemplatesResponse = CourseTemplatesRecord & BaseSystemFields
export type CoursesResponse<Texpand = unknown> = CoursesRecord & BaseSystemFields<Texpand>
export type DepartmentsResponse = DepartmentsRecord & BaseSystemFields
export type DocumentsResponse<Texpand = unknown> = DocumentsRecord & BaseSystemFields<Texpand>
export type EventDocumentsResponse<Texpand = unknown> = EventDocumentsRecord & BaseSystemFields<Texpand>
export type FullDocumentsResponse<Texpand = unknown> = FullDocumentsRecord & BaseSystemFields<Texpand>
export type MajorsResponse<Texpand = unknown> = MajorsRecord & BaseSystemFields<Texpand>
export type ParticipantsResponse<Texpand = unknown> = ParticipantsRecord & BaseSystemFields<Texpand>
export type PeopleResponse<Texpand = unknown> = PeopleRecord & BaseSystemFields<Texpand>
export type PersonalNotesResponse<Texpand = unknown> = PersonalNotesRecord & BaseSystemFields<Texpand>
export type RelationshipsResponse<Texpand = unknown> = RelationshipsRecord & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = UsersRecord & AuthSystemFields<Texpand>

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
	users: UsersRecord
}