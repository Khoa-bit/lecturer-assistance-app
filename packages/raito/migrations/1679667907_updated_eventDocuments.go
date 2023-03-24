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

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		// update
		edit_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tha3swja",
			"name": "fullDocument",
			"type": "relation",
			"required": true,
			"unique": false,
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
	})
}
