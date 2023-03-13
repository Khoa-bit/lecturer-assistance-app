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

		collection, err := dao.FindCollectionByNameOrId("rncqe4klgabuo3x")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("qwqmdr6a")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("rncqe4klgabuo3x")
		if err != nil {
			return err
		}

		// add
		del_major := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qwqmdr6a",
			"name": "major",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "8qzwbi8qig96dy3",
				"cascadeDelete": false
			}
		}`), del_major)
		collection.Schema.AddField(del_major)

		return dao.SaveCollection(collection)
	})
}
