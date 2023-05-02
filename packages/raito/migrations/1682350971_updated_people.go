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
		collection.Schema.RemoveField("1kwmlqmk")

		// add
		new_contactRoom := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "nifqrtzj",
			"name": "contactRoom",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_contactRoom)
		collection.Schema.AddField(new_contactRoom)

		// add
		new_contactLocation := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wew2tsct",
			"name": "contactLocation",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_contactLocation)
		collection.Schema.AddField(new_contactLocation)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// add
		del_contactLocation := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1kwmlqmk",
			"name": "contactLocation",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_contactLocation)
		collection.Schema.AddField(del_contactLocation)

		// remove
		collection.Schema.RemoveField("nifqrtzj")

		// remove
		collection.Schema.RemoveField("wew2tsct")

		return dao.SaveCollection(collection)
	})
}
