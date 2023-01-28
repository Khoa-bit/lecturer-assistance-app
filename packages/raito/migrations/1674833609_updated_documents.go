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

		// update
		edit_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "6lbioxm6",
			"name": "category",
			"type": "select",
			"required": false,
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
					"Personal notes",
					"Events"
				]
			}
		}`), edit_category)
		collection.Schema.AddField(edit_category)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// update
		edit_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "6lbioxm6",
			"name": "category",
			"type": "select",
			"required": false,
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
					"Personal notes"
				]
			}
		}`), edit_category)
		collection.Schema.AddField(edit_category)

		return dao.SaveCollection(collection)
	})
}
