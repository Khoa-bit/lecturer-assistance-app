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

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// add
		new_owner := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "p607nig8",
			"name": "owner",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": false
			}
		}`), new_owner)
		collection.Schema.AddField(new_owner)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("p607nig8")

		return dao.SaveCollection(collection)
	})
}
