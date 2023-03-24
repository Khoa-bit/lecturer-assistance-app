package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)")

		collection.ViewRule = types.Pointer("@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)")

		collection.CreateRule = types.Pointer("@request.auth.person.id = fullDocument.document.owner.id")

		collection.UpdateRule = types.Pointer("@request.auth.person.id = fullDocument.document.owner.id || (\n  @collection.participants.document.id ?= fullDocument.document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)")

		// remove
		collection.Schema.RemoveField("t8r5f5g8")

		// update
		edit_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tha3swja",
			"name": "fullDocument",
			"type": "relation",
			"required": true,
			"unique": true,
			"options": {
				"maxSelect": 1,
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true
			}
		}`), edit_fullDocument)
		collection.Schema.AddField(edit_fullDocument)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		collection.ViewRule = nil

		collection.CreateRule = nil

		collection.UpdateRule = nil

		// add
		del_document := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "t8r5f5g8",
			"name": "document",
			"type": "relation",
			"required": true,
			"unique": true,
			"options": {
				"maxSelect": 1,
				"collectionId": "j4ausx28rc681dq",
				"cascadeDelete": true
			}
		}`), del_document)
		collection.Schema.AddField(del_document)

		// update
		edit_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tha3swja",
			"name": "fullDocument",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true
			}
		}`), edit_fullDocument)
		collection.Schema.AddField(edit_fullDocument)

		return dao.SaveCollection(collection)
	})
}
