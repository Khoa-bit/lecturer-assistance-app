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

		// add
		new_attachmentsHash := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "l0pssxso",
			"name": "attachmentsHash",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_attachmentsHash)
		collection.Schema.AddField(new_attachmentsHash)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("l0pssxso")

		return dao.SaveCollection(collection)
	})
}
