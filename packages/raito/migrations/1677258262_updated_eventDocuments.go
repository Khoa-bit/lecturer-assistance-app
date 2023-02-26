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

		// update
		edit_recurring := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3zekeiww",
			"name": "recurring",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Once",
					"Daily",
					"Weekly",
					"Monthly",
					"Annually"
				]
			}
		}`), edit_recurring)
		collection.Schema.AddField(edit_recurring)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		// update
		edit_recurring := &schema.SchemaField{}
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
					"Daily",
					"Weekly",
					"Monthly",
					"Annually"
				]
			}
		}`), edit_recurring)
		collection.Schema.AddField(edit_recurring)

		return dao.SaveCollection(collection)
	})
}
