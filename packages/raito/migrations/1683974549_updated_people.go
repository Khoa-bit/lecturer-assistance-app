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
		new_isNew := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "zswnw7sd",
			"name": "isNew",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isNew)
		collection.Schema.AddField(new_isNew)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("zswnw7sd")

		return dao.SaveCollection(collection)
	})
}
