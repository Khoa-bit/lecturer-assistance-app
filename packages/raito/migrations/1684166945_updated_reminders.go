package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("wg26kw9i9qjmuoq")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT \n\ted.id,\n\ted.reminderAt,\n\tfullDocument.id fullDocument_id,\n\tfullDocument.internal fullDocument_internal,\n\tfullDocument_document.name fullDocument_document_name,\n\tfullDocument_document.priority fullDocument_document_priority,\n\tfullDocument_document.status fullDocument_document_status,\n\tfullDocument_document.startTime fullDocument_document_startTime,\n\tfullDocument_document.endTime fullDocument_document_endTime,\n\tfullDocument_document.description fullDocument_document_description,\n\tfullDocument_document_owner.name fullDocument_document_owner_name,\n\ttoFullDocument.id toFullDocument_id,\n\ttoFullDocument.internal toFullDocument_internal,\n\ttoFullDocument_document.name toFullDocument_document_name,\n\ttoFullDocument_document.priority toFullDocument_document_priority,\n\ttoFullDocument_document.status toFullDocument_document_status,\n\ttoFullDocument_document.startTime toFullDocument_document_startTime,\n\ttoFullDocument_document.endTime toFullDocument_document_endTime,\n\ttoFullDocument_document.description toFullDocument_document_description,\n\ttoFullDocument_document_owner.name toFullDocument_document_owner_name,\n\tGROUP_CONCAT(COALESCE(IFNULL(u.email, person.personalEmail), ''), ', ') AS allParticipantsEmails\nFROM eventDocuments ed \nINNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument \nINNER JOIN documents fullDocument_document ON fullDocument_document.id = fullDocument.document AND fullDocument_document.deleted == ''\nLEFT JOIN people fullDocument_document_owner ON fullDocument_document_owner.id = fullDocument_document.owner\nLEFT JOIN fullDocuments toFullDocument ON toFullDocument.id = ed.toFullDocument\nLEFT JOIN documents toFullDocument_document  ON toFullDocument_document.id = toFullDocument.document AND toFullDocument_document.deleted == ''\nLEFT JOIN people toFullDocument_document_owner ON toFullDocument_document_owner.id = toFullDocument_document.owner \nINNER JOIN participants p ON p.document = fullDocument_document.id\nLEFT JOIN users u ON u.person = p.person \nLEFT JOIN people person ON person.id = p.person\nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()\n"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("oz27z8yk")

		// remove
		collection.Schema.RemoveField("vyvckxj5")

		// remove
		collection.Schema.RemoveField("8nzsdihz")

		// remove
		collection.Schema.RemoveField("jqdahqov")

		// remove
		collection.Schema.RemoveField("h5enbive")

		// remove
		collection.Schema.RemoveField("vncr0ado")

		// remove
		collection.Schema.RemoveField("y1sgdrqs")

		// remove
		collection.Schema.RemoveField("cy6wvgxv")

		// remove
		collection.Schema.RemoveField("hposehi9")

		// remove
		collection.Schema.RemoveField("6stonew7")

		// remove
		collection.Schema.RemoveField("m5tfujby")

		// remove
		collection.Schema.RemoveField("mxisfuyq")

		// remove
		collection.Schema.RemoveField("eaqljnqi")

		// remove
		collection.Schema.RemoveField("2me7tfvi")

		// remove
		collection.Schema.RemoveField("mwyegb63")

		// remove
		collection.Schema.RemoveField("uvxzcfiq")

		// remove
		collection.Schema.RemoveField("cpdq4g6v")

		// remove
		collection.Schema.RemoveField("evxrh0nb")

		// remove
		collection.Schema.RemoveField("m9fpqvrp")

		// remove
		collection.Schema.RemoveField("smbydbkb")

		// add
		new_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "a8hv6p8y",
			"name": "reminderAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_reminderAt)
		collection.Schema.AddField(new_reminderAt)

		// add
		new_fullDocument_id := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "4s7qk3fp",
			"name": "fullDocument_id",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_fullDocument_id)
		collection.Schema.AddField(new_fullDocument_id)

		// add
		new_fullDocument_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "jofdbzrd",
			"name": "fullDocument_internal",
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
		}`), new_fullDocument_internal)
		collection.Schema.AddField(new_fullDocument_internal)

		// add
		new_fullDocument_document_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "h6y4z7ja",
			"name": "fullDocument_document_name",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_fullDocument_document_name)
		collection.Schema.AddField(new_fullDocument_document_name)

		// add
		new_fullDocument_document_priority := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "zkfhdbxh",
			"name": "fullDocument_document_priority",
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
		}`), new_fullDocument_document_priority)
		collection.Schema.AddField(new_fullDocument_document_priority)

		// add
		new_fullDocument_document_status := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rxizcqsy",
			"name": "fullDocument_document_status",
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
		}`), new_fullDocument_document_status)
		collection.Schema.AddField(new_fullDocument_document_status)

		// add
		new_fullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "fwamx9fa",
			"name": "fullDocument_document_startTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_fullDocument_document_startTime)
		collection.Schema.AddField(new_fullDocument_document_startTime)

		// add
		new_fullDocument_document_endTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "r34qjz38",
			"name": "fullDocument_document_endTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_fullDocument_document_endTime)
		collection.Schema.AddField(new_fullDocument_document_endTime)

		// add
		new_fullDocument_document_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xwgw0mxr",
			"name": "fullDocument_document_description",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_fullDocument_document_description)
		collection.Schema.AddField(new_fullDocument_document_description)

		// add
		new_fullDocument_document_owner_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "66xd66b1",
			"name": "fullDocument_document_owner_name",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_fullDocument_document_owner_name)
		collection.Schema.AddField(new_fullDocument_document_owner_name)

		// add
		new_toFullDocument_id := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "lzfj3dag",
			"name": "toFullDocument_id",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_toFullDocument_id)
		collection.Schema.AddField(new_toFullDocument_id)

		// add
		new_toFullDocument_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ixhndd1y",
			"name": "toFullDocument_internal",
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
		}`), new_toFullDocument_internal)
		collection.Schema.AddField(new_toFullDocument_internal)

		// add
		new_toFullDocument_document_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wauqitkh",
			"name": "toFullDocument_document_name",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_toFullDocument_document_name)
		collection.Schema.AddField(new_toFullDocument_document_name)

		// add
		new_toFullDocument_document_priority := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "sdnbwnvh",
			"name": "toFullDocument_document_priority",
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
		}`), new_toFullDocument_document_priority)
		collection.Schema.AddField(new_toFullDocument_document_priority)

		// add
		new_toFullDocument_document_status := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "t8d6hti5",
			"name": "toFullDocument_document_status",
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
		}`), new_toFullDocument_document_status)
		collection.Schema.AddField(new_toFullDocument_document_status)

		// add
		new_toFullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "0ucwkwsy",
			"name": "toFullDocument_document_startTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_toFullDocument_document_startTime)
		collection.Schema.AddField(new_toFullDocument_document_startTime)

		// add
		new_toFullDocument_document_endTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "18switi7",
			"name": "toFullDocument_document_endTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_toFullDocument_document_endTime)
		collection.Schema.AddField(new_toFullDocument_document_endTime)

		// add
		new_toFullDocument_document_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "hswkdoed",
			"name": "toFullDocument_document_description",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_toFullDocument_document_description)
		collection.Schema.AddField(new_toFullDocument_document_description)

		// add
		new_toFullDocument_document_owner_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uvtukbds",
			"name": "toFullDocument_document_owner_name",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_toFullDocument_document_owner_name)
		collection.Schema.AddField(new_toFullDocument_document_owner_name)

		// add
		new_allParticipantsEmails := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kki5fafh",
			"name": "allParticipantsEmails",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_allParticipantsEmails)
		collection.Schema.AddField(new_allParticipantsEmails)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("wg26kw9i9qjmuoq")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT \n\ted.id,\n\ted.reminderAt,\n\tfullDocument.id fullDocument_id,\n\tfullDocument.internal fullDocument_internal,\n\tfullDocument_document.name fullDocument_document_name,\n\tfullDocument_document.priority fullDocument_document_priority,\n\tfullDocument_document.status fullDocument_document_status,\n\tfullDocument_document.startTime fullDocument_document_startTime,\n\tfullDocument_document.endTime fullDocument_document_endTime,\n\tfullDocument_document.description fullDocument_document_description,\n\tfullDocument_document_owner.name fullDocument_document_owner_name,\n\ttoFullDocument.id toFullDocument_id,\n\ttoFullDocument.internal toFullDocument_internal,\n\ttoFullDocument_document.name toFullDocument_document_name,\n\ttoFullDocument_document.priority toFullDocument_document_priority,\n\ttoFullDocument_document.status toFullDocument_document_status,\n\ttoFullDocument_document.startTime toFullDocument_document_startTime,\n\ttoFullDocument_document.endTime toFullDocument_document_endTime,\n\ttoFullDocument_document.description toFullDocument_document_description,\n\ttoFullDocument_document_owner.name toFullDocument_document_owner_name,\n\tGROUP_CONCAT(COALESCE(IFNULL(u.email, person.personalEmail), ''), ', ') AS allParticipantsEmails\nFROM eventDocuments ed \nINNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument \nINNER JOIN documents fullDocument_document ON fullDocument_document.id = fullDocument.document \nLEFT JOIN people fullDocument_document_owner ON fullDocument_document_owner.id = fullDocument_document.owner\nLEFT JOIN fullDocuments toFullDocument ON toFullDocument.id = ed.toFullDocument\nLEFT JOIN documents toFullDocument_document  ON toFullDocument_document.id = toFullDocument.document \nLEFT JOIN people toFullDocument_document_owner ON toFullDocument_document_owner.id = toFullDocument_document.owner \nINNER JOIN participants p ON p.document = fullDocument_document.id\nLEFT JOIN users u ON u.person = p.person \nLEFT JOIN people person ON person.id = p.person\nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()\n"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "oz27z8yk",
			"name": "reminderAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_reminderAt)
		collection.Schema.AddField(del_reminderAt)

		// add
		del_fullDocument_id := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "vyvckxj5",
			"name": "fullDocument_id",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_fullDocument_id)
		collection.Schema.AddField(del_fullDocument_id)

		// add
		del_fullDocument_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "8nzsdihz",
			"name": "fullDocument_internal",
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
		}`), del_fullDocument_internal)
		collection.Schema.AddField(del_fullDocument_internal)

		// add
		del_fullDocument_document_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "jqdahqov",
			"name": "fullDocument_document_name",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_fullDocument_document_name)
		collection.Schema.AddField(del_fullDocument_document_name)

		// add
		del_fullDocument_document_priority := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "h5enbive",
			"name": "fullDocument_document_priority",
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
		}`), del_fullDocument_document_priority)
		collection.Schema.AddField(del_fullDocument_document_priority)

		// add
		del_fullDocument_document_status := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "vncr0ado",
			"name": "fullDocument_document_status",
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
		}`), del_fullDocument_document_status)
		collection.Schema.AddField(del_fullDocument_document_status)

		// add
		del_fullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "y1sgdrqs",
			"name": "fullDocument_document_startTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_fullDocument_document_startTime)
		collection.Schema.AddField(del_fullDocument_document_startTime)

		// add
		del_fullDocument_document_endTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "cy6wvgxv",
			"name": "fullDocument_document_endTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_fullDocument_document_endTime)
		collection.Schema.AddField(del_fullDocument_document_endTime)

		// add
		del_fullDocument_document_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "hposehi9",
			"name": "fullDocument_document_description",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_fullDocument_document_description)
		collection.Schema.AddField(del_fullDocument_document_description)

		// add
		del_fullDocument_document_owner_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "6stonew7",
			"name": "fullDocument_document_owner_name",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_fullDocument_document_owner_name)
		collection.Schema.AddField(del_fullDocument_document_owner_name)

		// add
		del_toFullDocument_id := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "m5tfujby",
			"name": "toFullDocument_id",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_toFullDocument_id)
		collection.Schema.AddField(del_toFullDocument_id)

		// add
		del_toFullDocument_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mxisfuyq",
			"name": "toFullDocument_internal",
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
		}`), del_toFullDocument_internal)
		collection.Schema.AddField(del_toFullDocument_internal)

		// add
		del_toFullDocument_document_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "eaqljnqi",
			"name": "toFullDocument_document_name",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_toFullDocument_document_name)
		collection.Schema.AddField(del_toFullDocument_document_name)

		// add
		del_toFullDocument_document_priority := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "2me7tfvi",
			"name": "toFullDocument_document_priority",
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
		}`), del_toFullDocument_document_priority)
		collection.Schema.AddField(del_toFullDocument_document_priority)

		// add
		del_toFullDocument_document_status := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mwyegb63",
			"name": "toFullDocument_document_status",
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
		}`), del_toFullDocument_document_status)
		collection.Schema.AddField(del_toFullDocument_document_status)

		// add
		del_toFullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uvxzcfiq",
			"name": "toFullDocument_document_startTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_toFullDocument_document_startTime)
		collection.Schema.AddField(del_toFullDocument_document_startTime)

		// add
		del_toFullDocument_document_endTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "cpdq4g6v",
			"name": "toFullDocument_document_endTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_toFullDocument_document_endTime)
		collection.Schema.AddField(del_toFullDocument_document_endTime)

		// add
		del_toFullDocument_document_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "evxrh0nb",
			"name": "toFullDocument_document_description",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_toFullDocument_document_description)
		collection.Schema.AddField(del_toFullDocument_document_description)

		// add
		del_toFullDocument_document_owner_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "m9fpqvrp",
			"name": "toFullDocument_document_owner_name",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_toFullDocument_document_owner_name)
		collection.Schema.AddField(del_toFullDocument_document_owner_name)

		// add
		del_allParticipantsEmails := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "smbydbkb",
			"name": "allParticipantsEmails",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_allParticipantsEmails)
		collection.Schema.AddField(del_allParticipantsEmails)

		// remove
		collection.Schema.RemoveField("a8hv6p8y")

		// remove
		collection.Schema.RemoveField("4s7qk3fp")

		// remove
		collection.Schema.RemoveField("jofdbzrd")

		// remove
		collection.Schema.RemoveField("h6y4z7ja")

		// remove
		collection.Schema.RemoveField("zkfhdbxh")

		// remove
		collection.Schema.RemoveField("rxizcqsy")

		// remove
		collection.Schema.RemoveField("fwamx9fa")

		// remove
		collection.Schema.RemoveField("r34qjz38")

		// remove
		collection.Schema.RemoveField("xwgw0mxr")

		// remove
		collection.Schema.RemoveField("66xd66b1")

		// remove
		collection.Schema.RemoveField("lzfj3dag")

		// remove
		collection.Schema.RemoveField("ixhndd1y")

		// remove
		collection.Schema.RemoveField("wauqitkh")

		// remove
		collection.Schema.RemoveField("sdnbwnvh")

		// remove
		collection.Schema.RemoveField("t8d6hti5")

		// remove
		collection.Schema.RemoveField("0ucwkwsy")

		// remove
		collection.Schema.RemoveField("18switi7")

		// remove
		collection.Schema.RemoveField("hswkdoed")

		// remove
		collection.Schema.RemoveField("uvtukbds")

		// remove
		collection.Schema.RemoveField("kki5fafh")

		return dao.SaveCollection(collection)
	})
}
