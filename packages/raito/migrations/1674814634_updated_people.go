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

		// update
		edit_personId := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3url41zb",
			"name": "personId",
			"type": "text",
			"required": false,
			"unique": true,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_personId)
		collection.Schema.AddField(edit_personId)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// update
		edit_personId := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3url41zb",
			"name": "personId",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_personId)
		collection.Schema.AddField(edit_personId)

		return dao.SaveCollection(collection)
	})
}
