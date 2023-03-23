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

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// update
		edit_major := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "5xrxsdqv",
			"name": "major",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "8qzwbi8qig96dy3",
				"cascadeDelete": false
			}
		}`), edit_major)
		collection.Schema.AddField(edit_major)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// update
		edit_major := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "5xrxsdqv",
			"name": "department",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "rncqe4klgabuo3x",
				"cascadeDelete": false
			}
		}`), edit_major)
		collection.Schema.AddField(edit_major)

		return dao.SaveCollection(collection)
	})
}
