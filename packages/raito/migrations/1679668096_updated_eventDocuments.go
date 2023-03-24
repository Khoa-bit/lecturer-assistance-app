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

		// add
		new_toFullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "u2s9chxw",
			"name": "toFullDocument",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true
			}
		}`), new_toFullDocument)
		collection.Schema.AddField(new_toFullDocument)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("u2s9chxw")

		return dao.SaveCollection(collection)
	})
}
