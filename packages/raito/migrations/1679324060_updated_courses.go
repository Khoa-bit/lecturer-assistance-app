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

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		// update
		edit_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "vtbu4ebk",
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

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		// update
		edit_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "vtbu4ebk",
			"name": "document",
			"type": "relation",
			"required": true,
			"unique": true,
			"options": {
				"maxSelect": 1,
				"collectionId": "j4ausx28rc681dq",
				"cascadeDelete": true
			}
		}`), edit_fullDocument)
		collection.Schema.AddField(edit_fullDocument)

		return dao.SaveCollection(collection)
	})
}
