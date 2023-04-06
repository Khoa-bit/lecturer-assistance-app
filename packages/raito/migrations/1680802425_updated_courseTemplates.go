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

		collection, err := dao.FindCollectionByNameOrId("w1u7k3atie2fwvi")
		if err != nil {
			return err
		}

		// add
		new_academicProgram := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "q1fg7f2w",
			"name": "academicProgram",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Undergradute",
					"Graduate"
				]
			}
		}`), new_academicProgram)
		collection.Schema.AddField(new_academicProgram)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("w1u7k3atie2fwvi")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("q1fg7f2w")

		return dao.SaveCollection(collection)
	})
}
