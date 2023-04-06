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

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// update
		edit_trainingSystem := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uea7jv6d",
			"name": "trainingSystem",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Undergraduate",
					"Graduate"
				]
			}
		}`), edit_trainingSystem)
		collection.Schema.AddField(edit_trainingSystem)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// update
		edit_trainingSystem := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uea7jv6d",
			"name": "trainingSystem",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Undergraduate"
				]
			}
		}`), edit_trainingSystem)
		collection.Schema.AddField(edit_trainingSystem)

		return dao.SaveCollection(collection)
	})
}
