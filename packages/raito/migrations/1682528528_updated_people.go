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

		// remove
		collection.Schema.RemoveField("wma9olod")

		// remove
		collection.Schema.RemoveField("izjorsxc")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// add
		del_isAdvisor := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wma9olod",
			"name": "isAdvisor",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isAdvisor)
		collection.Schema.AddField(del_isAdvisor)

		// add
		del_isLecturer := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "izjorsxc",
			"name": "isLecturer",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isLecturer)
		collection.Schema.AddField(del_isLecturer)

		return dao.SaveCollection(collection)
	})
}
