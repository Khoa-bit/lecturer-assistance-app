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

		collection, err := dao.FindCollectionByNameOrId("8qzwbi8qig96dy3")
		if err != nil {
			return err
		}

		// add
		new_department := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mesx0ym5",
			"name": "department",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "rncqe4klgabuo3x",
				"cascadeDelete": true
			}
		}`), new_department)
		collection.Schema.AddField(new_department)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("8qzwbi8qig96dy3")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("mesx0ym5")

		return dao.SaveCollection(collection)
	})
}
