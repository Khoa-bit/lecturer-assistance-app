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
		edit_gender := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rvacb4gs",
			"name": "gender",
			"type": "select",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Male",
					"Female",
					"Non-Binary",
					"Not Listed"
				]
			}
		}`), edit_gender)
		collection.Schema.AddField(edit_gender)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// update
		edit_gender := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rvacb4gs",
			"name": "gender",
			"type": "select",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Man",
					"Woman",
					"Non-Binary",
					"Not Listed"
				]
			}
		}`), edit_gender)
		collection.Schema.AddField(edit_gender)

		return dao.SaveCollection(collection)
	})
}
