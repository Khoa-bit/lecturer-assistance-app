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

		// remove
		collection.Schema.RemoveField("bece22zk")

		// add
		new_recurring := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3zekeiww",
			"name": "recurring",
			"type": "select",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"daily",
					"weekly",
					"monthly",
					"annually"
				]
			}
		}`), new_recurring)
		collection.Schema.AddField(new_recurring)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		// add
		del_recurring := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "bece22zk",
			"name": "recurring",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_recurring)
		collection.Schema.AddField(del_recurring)

		// remove
		collection.Schema.RemoveField("3zekeiww")

		return dao.SaveCollection(collection)
	})
}
