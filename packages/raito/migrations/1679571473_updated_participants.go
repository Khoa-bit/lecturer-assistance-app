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

		collection, err := dao.FindCollectionByNameOrId("d1gfoputrdow7mx")
		if err != nil {
			return err
		}

		// update
		edit_document := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "bnhqtxmx",
			"name": "document",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "j4ausx28rc681dq",
				"cascadeDelete": true
			}
		}`), edit_document)
		collection.Schema.AddField(edit_document)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("d1gfoputrdow7mx")
		if err != nil {
			return err
		}

		// update
		edit_document := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "bnhqtxmx",
			"name": "document",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "j4ausx28rc681dq",
				"cascadeDelete": false
			}
		}`), edit_document)
		collection.Schema.AddField(edit_document)

		return dao.SaveCollection(collection)
	})
}
