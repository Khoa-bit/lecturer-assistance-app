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

		// add
		new_internal := &schema.SchemaField{}
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
		}`), new_internal)
		collection.Schema.AddField(new_internal)

		// update
		edit_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1xozu39q",
			"name": "category",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"International journals - Rank 1",
					"International journals - Rank 2",
					"International journals - Other",
					"National journals",
					"Monographs",
					"Curriculums",
					"Reference books",
					"Manual books",
					"Draft"
				]
			}
		}`), edit_category)
		collection.Schema.AddField(edit_category)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("kmfi6vgd")

		// update
		edit_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1xozu39q",
			"name": "category",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"International journals - Rank 1",
					"International journals - Rank 2",
					"International journals - Other",
					"National journals",
					"Monographs",
					"Curriculums",
					"Reference books",
					"Manual books",
					"Draft",
					"Internal"
				]
			}
		}`), edit_category)
		collection.Schema.AddField(edit_category)

		return dao.SaveCollection(collection)
	})
}
