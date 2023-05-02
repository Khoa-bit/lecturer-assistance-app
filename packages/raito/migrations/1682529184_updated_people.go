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
		new_isLecturer := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "68gd2lrk",
			"name": "isLecturer",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isLecturer)
		collection.Schema.AddField(new_isLecturer)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("68gd2lrk")

		return dao.SaveCollection(collection)
	})
}
