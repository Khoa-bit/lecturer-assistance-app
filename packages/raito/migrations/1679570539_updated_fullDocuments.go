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

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		// update
		edit_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kmfi6vgd",
			"name": "internal",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Course",
					"Class"
				]
			}
		}`), edit_internal)
		collection.Schema.AddField(edit_internal)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		// update
		edit_internal := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kmfi6vgd",
			"name": "internal",
			"type": "select",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"Course",
					"Class"
				]
			}
		}`), edit_internal)
		collection.Schema.AddField(edit_internal)

		return dao.SaveCollection(collection)
	})
}
