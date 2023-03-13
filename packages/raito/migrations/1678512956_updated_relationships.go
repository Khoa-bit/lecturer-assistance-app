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

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		// update
		edit_toPerson := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uk38iicu",
			"name": "toPerson",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": false
			}
		}`), edit_toPerson)
		collection.Schema.AddField(edit_toPerson)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		// update
		edit_toPerson := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uk38iicu",
			"name": "toPerson",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": false
			}
		}`), edit_toPerson)
		collection.Schema.AddField(edit_toPerson)

		return dao.SaveCollection(collection)
	})
}
