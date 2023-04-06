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
		edit_academicProgram := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uea7jv6d",
			"name": "academicProgram",
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
		}`), edit_academicProgram)
		collection.Schema.AddField(edit_academicProgram)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// update
		edit_academicProgram := &schema.SchemaField{}
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
		}`), edit_academicProgram)
		collection.Schema.AddField(edit_academicProgram)

		return dao.SaveCollection(collection)
	})
}
