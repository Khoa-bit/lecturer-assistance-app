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

		// remove
		collection.Schema.RemoveField("lb6sjqrk")

		// add
		new_richText := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mdzr68dz",
			"name": "richText",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_richText)
		collection.Schema.AddField(new_richText)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// add
		del_richText := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "lb6sjqrk",
			"name": "richText",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_richText)
		collection.Schema.AddField(del_richText)

		// remove
		collection.Schema.RemoveField("mdzr68dz")

		return dao.SaveCollection(collection)
	})
}
