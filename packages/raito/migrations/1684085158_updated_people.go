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

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// add
		new_hasAccount := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "pyjja1sg",
			"name": "hasAccount",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_hasAccount)
		collection.Schema.AddField(new_hasAccount)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("pyjja1sg")

		return dao.SaveCollection(collection)
	})
}
