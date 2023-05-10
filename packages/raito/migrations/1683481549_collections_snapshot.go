package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "e8b4edpfxo6tszo",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.471Z",
				"name": "attachments",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "c92e80nh",
						"name": "file",
						"type": "file",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [],
							"thumbs": [],
							"protected": false
						}
					},
					{
						"system": false,
						"id": "yyzvvscf",
						"name": "document",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "j4ausx28rc681dq",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_e8b4edpfxo6tszo_created_idx` + "`" + ` ON ` + "`" + `attachments` + "`" + ` (` + "`" + `created` + "`" + `)"
				],
				"listRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"updateRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"options": {}
			},
			{
				"id": "lbkbtnakhaudvls",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.471Z",
				"name": "classes",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "9xig2jh5",
						"name": "classId",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "2lps3f5n",
						"name": "cohort",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "5xrxsdqv",
						"name": "major",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "8qzwbi8qig96dy3",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "uea7jv6d",
						"name": "academicProgram",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Undergraduate",
								"Graduate"
							]
						}
					},
					{
						"system": false,
						"id": "wdhjxrtl",
						"name": "fullDocument",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_lbkbtnakhaudvls_created_idx` + "`" + ` ON ` + "`" + `classes` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_wdhjxrtl\" on \"classes\" (\"fullDocument\")"
				],
				"listRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = fullDocument.document.owner.id",
				"updateRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "w1u7k3atie2fwvi",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.471Z",
				"name": "courseTemplates",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ufi9u5zx",
						"name": "courseId",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "oqr2aiwj",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "tiejcs80",
						"name": "periodsCount",
						"type": "number",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "q1fg7f2w",
						"name": "academicProgram",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Undergradute",
								"Graduate"
							]
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_w1u7k3atie2fwvi_created_idx` + "`" + ` ON ` + "`" + `courseTemplates` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_oqr2aiwj\" on \"courseTemplates\" (\"name\")"
				],
				"listRule": "@request.auth.id != \"\"",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": "@request.auth.id != \"\"",
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2vda8dzur6jhdxy",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.472Z",
				"name": "courses",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "rp94rzbl",
						"name": "courseTemplate",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "w1u7k3atie2fwvi",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "mk7oodyt",
						"name": "semester",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "vtbu4ebk",
						"name": "fullDocument",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_2vda8dzur6jhdxy_created_idx` + "`" + ` ON ` + "`" + `courses` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_vtbu4ebk\" on \"courses\" (\"fullDocument\")"
				],
				"listRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = fullDocument.document.owner.id",
				"updateRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "rncqe4klgabuo3x",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.472Z",
				"name": "departments",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "cl2agxi7",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_rncqe4klgabuo3x_created_idx` + "`" + ` ON ` + "`" + `departments` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_cl2agxi7\" on \"departments\" (\"name\")"
				],
				"listRule": "@request.auth.id != \"\"",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "j4ausx28rc681dq",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 16:39:16.104Z",
				"name": "documents",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "2uoyxb26",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "1ek0nj8b",
						"name": "thumbnail",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [],
							"thumbs": [],
							"protected": false
						}
					},
					{
						"system": false,
						"id": "a1ot8na9",
						"name": "priority",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Lower",
								"Low",
								"Medium",
								"High",
								"Higher"
							]
						}
					},
					{
						"system": false,
						"id": "dhueurhe",
						"name": "status",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Todo",
								"In progress",
								"Review",
								"Done",
								"Closed"
							]
						}
					},
					{
						"system": false,
						"id": "qprx5ng2",
						"name": "diffHash",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "p607nig8",
						"name": "owner",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "vks6ezu0clb3qja",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "0vetkuvs",
						"name": "deleted",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "mdzr68dz",
						"name": "richText",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "l0pssxso",
						"name": "attachmentsHash",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ewpfczdf",
						"name": "startTime",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "sj2wqg4h",
						"name": "endTime",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "lxcn2l2p",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_j4ausx28rc681dq_created_idx` + "`" + ` ON ` + "`" + `documents` + "`" + ` (` + "`" + `created` + "`" + `)"
				],
				"listRule": "@request.auth.person.id = owner.id || (\n  @collection.participants.document.id ?= id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = owner.id || (\n  @collection.participants.document.id ?= id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = @request.data.owner",
				"updateRule": "@request.auth.person.id = owner.id || (\n  @collection.participants.document.id ?= id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "fdvpbps19x0r7r0",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-06 09:19:32.927Z",
				"name": "eventDocuments",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "tha3swja",
						"name": "fullDocument",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "3zekeiww",
						"name": "recurring",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Once",
								"Daily",
								"Weekly",
								"Monthly",
								"Annually"
							]
						}
					},
					{
						"system": false,
						"id": "u2s9chxw",
						"name": "toFullDocument",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "vk3zctoo",
						"name": "reminderAt",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_fdvpbps19x0r7r0_created_idx` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX ` + "`" + `idx_unique_tha3swja` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `fullDocument` + "`" + `)",
					"CREATE INDEX ` + "`" + `idx_UKGxIUL` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `reminderAt` + "`" + `)"
				],
				"listRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = fullDocument.document.owner.id",
				"updateRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "gcqfd846lugrlnj",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.473Z",
				"name": "fullDocuments",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "fqz8anf2",
						"name": "document",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "j4ausx28rc681dq",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "kmfi6vgd",
						"name": "internal",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Academic material",
								"Course",
								"Class",
								"Personal note",
								"Event"
							]
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_gcqfd846lugrlnj_created_idx` + "`" + ` ON ` + "`" + `fullDocuments` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_fqz8anf2\" on \"fullDocuments\" (\"document\")"
				],
				"listRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = document.owner.id",
				"updateRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "8qzwbi8qig96dy3",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.474Z",
				"name": "majors",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "0r6kke4b",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "mesx0ym5",
						"name": "department",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "rncqe4klgabuo3x",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_8qzwbi8qig96dy3_created_idx` + "`" + ` ON ` + "`" + `majors` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_0r6kke4b\" on \"majors\" (\"name\")"
				],
				"listRule": "@request.auth.id != \"\"",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "d1gfoputrdow7mx",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.474Z",
				"name": "participants",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "227i0wxj",
						"name": "permission",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"read",
								"comment",
								"write"
							]
						}
					},
					{
						"system": false,
						"id": "cq6ifear",
						"name": "role",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ranibkpo",
						"name": "note",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "bnhqtxmx",
						"name": "document",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "j4ausx28rc681dq",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "m5yykllq",
						"name": "person",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "vks6ezu0clb3qja",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_d1gfoputrdow7mx_created_idx` + "`" + ` ON ` + "`" + `participants` + "`" + ` (` + "`" + `created` + "`" + `)"
				],
				"listRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"updateRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": "@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"options": {}
			},
			{
				"id": "vks6ezu0clb3qja",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-02 09:07:13.475Z",
				"name": "people",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "3url41zb",
						"name": "personId",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rcllt17h",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "uobc2ok6",
						"name": "avatar",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif",
								"image/webp"
							],
							"thumbs": [],
							"protected": false
						}
					},
					{
						"system": false,
						"id": "tqecd1dc",
						"name": "phone",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": "^\\d+$"
						}
					},
					{
						"system": false,
						"id": "scvvf02v",
						"name": "personalEmail",
						"type": "email",
						"required": false,
						"unique": false,
						"options": {
							"exceptDomains": null,
							"onlyDomains": null
						}
					},
					{
						"system": false,
						"id": "p9j3qlmc",
						"name": "title",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ihzcpbqt",
						"name": "placeOfBirth",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rvacb4gs",
						"name": "gender",
						"type": "select",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"Male",
								"Female",
								"Non-Binary",
								"Not Listed"
							]
						}
					},
					{
						"system": false,
						"id": "y6l0vv3j",
						"name": "major",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "8qzwbi8qig96dy3",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "fyjj6s2d",
						"name": "deleted",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "5q3g4zcy",
						"name": "thumbnail",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif",
								"image/webp"
							],
							"thumbs": [],
							"protected": false
						}
					},
					{
						"system": false,
						"id": "g5ktnfs4",
						"name": "interests",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "nifqrtzj",
						"name": "contactRoom",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "wew2tsct",
						"name": "contactLocation",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ghrmhhh1",
						"name": "experience",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "02ey32bi",
						"name": "education",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "68gd2lrk",
						"name": "isFaculty",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_vks6ezu0clb3qja_created_idx` + "`" + ` ON ` + "`" + `people` + "`" + ` (` + "`" + `created` + "`" + `)"
				],
				"listRule": "@request.auth.id != \"\"",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": "@request.auth.id != \"\"",
				"updateRule": "@request.auth.id != \"\"",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "q22h280gruk59ry",
				"created": "2023-01-26 16:07:11.063Z",
				"updated": "2023-05-05 06:32:03.570Z",
				"name": "relationships",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "4si6gxog",
						"name": "fromPerson",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "vks6ezu0clb3qja",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "uk38iicu",
						"name": "toPerson",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "vks6ezu0clb3qja",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_q22h280gruk59ry_created_idx` + "`" + ` ON ` + "`" + `relationships` + "`" + ` (` + "`" + `created` + "`" + `)"
				],
				"listRule": "@request.auth.id != \"\"",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": "@request.auth.id != \"\"",
				"updateRule": "@request.auth.id != \"\"",
				"deleteRule": "@request.auth.id != \"\"",
				"options": {}
			},
			{
				"id": "_pb_users_auth_",
				"created": "2023-01-27 10:59:43.564Z",
				"updated": "2023-05-02 09:07:13.470Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "tjtkcplz",
						"name": "person",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "vks6ezu0clb3qja",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `__pb_users_auth__created_idx` + "`" + ` ON ` + "`" + `users` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_tjtkcplz\" on \"users\" (\"person\")"
				],
				"listRule": "id = @request.auth.id",
				"viewRule": "@request.auth.id != \"\"",
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {
					"allowEmailAuth": true,
					"allowOAuth2Auth": true,
					"allowUsernameAuth": true,
					"exceptEmailDomains": null,
					"manageRule": null,
					"minPasswordLength": 8,
					"onlyEmailDomains": null,
					"requireEmail": false
				}
			},
			{
				"id": "fewbiz09m7bi4kg",
				"created": "2023-03-23 00:58:08.847Z",
				"updated": "2023-05-02 09:07:13.476Z",
				"name": "personalNotes",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "xu7lw6et",
						"name": "fullDocument",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_fewbiz09m7bi4kg_created_idx` + "`" + ` ON ` + "`" + `personalNotes` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_xu7lw6et\" on \"personalNotes\" (\"fullDocument\")"
				],
				"listRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = fullDocument.document.owner.id",
				"updateRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "ykaefycx2ie9dtn",
				"created": "2023-03-23 11:01:17.972Z",
				"updated": "2023-05-02 09:07:13.477Z",
				"name": "academicMaterials",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "js4r6fcc",
						"name": "category",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"International journals - Rank 1",
								"International journals - Rank 2",
								"International journals - Other",
								"National journals",
								"Conference",
								"Monographs",
								"Curriculums",
								"Reference books",
								"Manual books",
								"Draft"
							]
						}
					},
					{
						"system": false,
						"id": "gy4j389h",
						"name": "fullDocument",
						"type": "relation",
						"required": true,
						"unique": true,
						"options": {
							"collectionId": "gcqfd846lugrlnj",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE INDEX ` + "`" + `_ykaefycx2ie9dtn_created_idx` + "`" + ` ON ` + "`" + `academicMaterials` + "`" + ` (` + "`" + `created` + "`" + `)",
					"CREATE UNIQUE INDEX \"idx_unique_gy4j389h\" on \"academicMaterials\" (\"fullDocument\")"
				],
				"listRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"viewRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"createRule": "@request.auth.person.id = fullDocument.document.owner.id",
				"updateRule": "@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)",
				"deleteRule": null,
				"options": {}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
