/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	TestDB = "testDB",
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

export enum TestDBSelectFieldOptions {
	"option1" = "option1",
	"option2" = "option2",
	"option3" = "option3",
}
export type TestDBRecord = {
	selectField?: TestDBSelectFieldOptions
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type TestDBResponse = TestDBRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	testDB: TestDBRecord
	users: UsersRecord
}