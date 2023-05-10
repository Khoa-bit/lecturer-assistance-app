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
			"query": "SELECT \n\ted.id,\n\ted.reminderAt,\n\tfullDocument.id fullDocument_id,\n\tfullDocument.internal fullDocument_internal,\n\tfullDocument_document.name fullDocument_document_name,\n\tfullDocument_document.priority fullDocument_document_priority,\n\tfullDocument_document.status fullDocument_document_status,\n\tfullDocument_document.startTime fullDocument_document_startTime,\n\tfullDocument_document.endTime fullDocument_document_endTime,\n\tfullDocument_document.description fullDocument_document_description,\n\tfullDocument_document_owner.name fullDocument_document_owner_name,\n\ttoFullDocument.id toFullDocument_id,\n\ttoFullDocument.internal toFullDocument_internal,\n\ttoFullDocument_document.name toFullDocument_document_name,\n\ttoFullDocument_document.priority toFullDocument_document_priority,\n\ttoFullDocument_document.status toFullDocument_document_status,\n\ttoFullDocument_document.startTime toFullDocument_document_startTime,\n\ttoFullDocument_document.endTime toFullDocument_document_endTime,\n\ttoFullDocument_document.description toFullDocument_document_description,\n\ttoFullDocument_document_owner.name toFullDocument_document_owner_name,\n\tGROUP_CONCAT(COALESCE(IFNULL(u.email, person.personalEmail), ''), ', ') AS allParticipantsEmails\nFROM eventDocuments ed \nINNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument \nINNER JOIN documents fullDocument_document ON fullDocument_document.id = fullDocument.document \nLEFT JOIN people fullDocument_document_owner ON person.id = fullDocument_document.owner\nLEFT JOIN fullDocuments toFullDocument ON toFullDocument.id = ed.toFullDocument\nLEFT JOIN documents toFullDocument_document  ON toFullDocument_document.id = toFullDocument.document \nLEFT JOIN people toFullDocument_document_owner ON person.id = toFullDocument_document.owner \nINNER JOIN participants p ON p.document = fullDocument_document.id\nLEFT JOIN users u ON u.person = p.person \nLEFT JOIN people person ON person.id = p.person\nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()\n"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("qffbztc5")

		// remove
		collection.Schema.RemoveField("ls9qowt9")

		// remove
		collection.Schema.RemoveField("lytitt6v")

		// remove
		collection.Schema.RemoveField("tqj6by5s")

		// remove
		collection.Schema.RemoveField("sepqqjfs")

		// remove
		collection.Schema.RemoveField("hkily0op")

		// remove
		collection.Schema.RemoveField("wgutv9rv")

		// remove
		collection.Schema.RemoveField("gob9ml70")

		// remove
		collection.Schema.RemoveField("c1nsyq7k")

		// remove
		collection.Schema.RemoveField("pix7rlpv")

		// remove
		collection.Schema.RemoveField("sagmnftg")

		// remove
		collection.Schema.RemoveField("xakxv5kf")

		// remove
		collection.Schema.RemoveField("6zq9htk2")

		// remove
		collection.Schema.RemoveField("nxt9c4js")

		// remove
		collection.Schema.RemoveField("fy14jlet")

		// remove
		collection.Schema.RemoveField("iqcojrsq")

		// remove
		collection.Schema.RemoveField("z9u7a6jw")

		// remove
		collection.Schema.RemoveField("8jrddn7s")

		// remove
		collection.Schema.RemoveField("k73a6dfi")

		// remove
		collection.Schema.RemoveField("dxcijrlq")

		// add
		new_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "cbpcjnla",
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
			"id": "f9dryvgk",
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
			"id": "e4ojlhtv",
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
			"id": "o4vycgsj",
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
			"id": "p6wcfe1t",
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
			"id": "zzruaobm",
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
			"id": "n8ud5zkp",
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
			"id": "wlozu4gs",
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
			"id": "kxenrqaf",
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
			"id": "ysplxjdv",
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
			"id": "j6dmoulb",
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
			"id": "hswbaafo",
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
			"id": "nsc0lo5d",
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
			"id": "m6miudoc",
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
			"id": "hxqjz2vd",
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
			"id": "jjomrn21",
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
			"id": "byolgh9n",
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
			"id": "fbimamb0",
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
			"id": "rtfrytcv",
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
			"id": "0vjocb5z",
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
			"query": "SELECT \n\ted.id,\n\ted.reminderAt,\n\tfullDocument.id fullDocument_id,\n\tfullDocument.internal fullDocument_internal,\n\tfullDocument_document.name fullDocument_document_name,\n\tfullDocument_document.priority fullDocument_document_priority,\n\tfullDocument_document.status fullDocument_document_status,\n\tfullDocument_document.owner fullDocument_document_owner,\n\tfullDocument_document.startTime fullDocument_document_startTime,\n\tfullDocument_document.endTime fullDocument_document_endTime,\n\tfullDocument_document.description fullDocument_document_description,\n\ttoFullDocument.id toFullDocument_id,\n\ttoFullDocument.internal toFullDocument_internal,\n\ttoFullDocument_document.name toFullDocument_document_name,\n\ttoFullDocument_document.priority toFullDocument_document_priority,\n\ttoFullDocument_document.status toFullDocument_document_status,\n\ttoFullDocument_document.owner toFullDocument_document_owner,\n\ttoFullDocument_document.startTime toFullDocument_document_startTime,\n\ttoFullDocument_document.endTime toFullDocument_document_endTime,\n\ttoFullDocument_document.description toFullDocument_document_description,\n\tGROUP_CONCAT(COALESCE(IFNULL(u.email, person.personalEmail), ''), ', ') AS allParticipantsEmails\nFROM eventDocuments ed \nINNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument \nINNER JOIN documents fullDocument_document ON fullDocument_document.id = fullDocument.document \nLEFT JOIN fullDocuments toFullDocument ON toFullDocument.id = ed.toFullDocument\nLEFT JOIN documents toFullDocument_document  ON toFullDocument_document.id = toFullDocument.document \nINNER JOIN participants p ON p.document = fullDocument_document.id\nLEFT JOIN users u ON u.person = p.person \nLEFT JOIN people person ON person.id = p.person \nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()\n"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qffbztc5",
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
			"id": "ls9qowt9",
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
			"id": "lytitt6v",
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
			"id": "tqj6by5s",
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
			"id": "sepqqjfs",
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
			"id": "hkily0op",
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
		del_fullDocument_document_owner := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wgutv9rv",
			"name": "fullDocument_document_owner",
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
		}`), del_fullDocument_document_owner)
		collection.Schema.AddField(del_fullDocument_document_owner)

		// add
		del_fullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "gob9ml70",
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
			"id": "c1nsyq7k",
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
			"id": "pix7rlpv",
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
		del_toFullDocument_id := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "sagmnftg",
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
			"id": "xakxv5kf",
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
			"id": "6zq9htk2",
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
			"id": "nxt9c4js",
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
			"id": "fy14jlet",
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
		del_toFullDocument_document_owner := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "iqcojrsq",
			"name": "toFullDocument_document_owner",
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
		}`), del_toFullDocument_document_owner)
		collection.Schema.AddField(del_toFullDocument_document_owner)

		// add
		del_toFullDocument_document_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "z9u7a6jw",
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
			"id": "8jrddn7s",
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
			"id": "k73a6dfi",
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
		del_allParticipantsEmails := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "dxcijrlq",
			"name": "allParticipantsEmails",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_allParticipantsEmails)
		collection.Schema.AddField(del_allParticipantsEmails)

		// remove
		collection.Schema.RemoveField("cbpcjnla")

		// remove
		collection.Schema.RemoveField("f9dryvgk")

		// remove
		collection.Schema.RemoveField("e4ojlhtv")

		// remove
		collection.Schema.RemoveField("o4vycgsj")

		// remove
		collection.Schema.RemoveField("p6wcfe1t")

		// remove
		collection.Schema.RemoveField("zzruaobm")

		// remove
		collection.Schema.RemoveField("n8ud5zkp")

		// remove
		collection.Schema.RemoveField("wlozu4gs")

		// remove
		collection.Schema.RemoveField("kxenrqaf")

		// remove
		collection.Schema.RemoveField("ysplxjdv")

		// remove
		collection.Schema.RemoveField("j6dmoulb")

		// remove
		collection.Schema.RemoveField("hswbaafo")

		// remove
		collection.Schema.RemoveField("nsc0lo5d")

		// remove
		collection.Schema.RemoveField("m6miudoc")

		// remove
		collection.Schema.RemoveField("hxqjz2vd")

		// remove
		collection.Schema.RemoveField("jjomrn21")

		// remove
		collection.Schema.RemoveField("byolgh9n")

		// remove
		collection.Schema.RemoveField("fbimamb0")

		// remove
		collection.Schema.RemoveField("rtfrytcv")

		// remove
		collection.Schema.RemoveField("0vjocb5z")

		return dao.SaveCollection(collection)
	})
}
