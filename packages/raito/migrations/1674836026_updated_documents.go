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
		collection.Schema.RemoveField("p9giqklm")

		// remove
		collection.Schema.RemoveField("kqh3lulz")

		// remove
		collection.Schema.RemoveField("zdkxmyir")

		// remove
		collection.Schema.RemoveField("xvyswwj4")

		// update
		edit_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "6lbioxm6",
			"name": "category",
			"type": "select",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"eventDocument",
					"fullDocument",
					"class",
					"course"
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

		// add
		del_isEventDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "p9giqklm",
			"name": "isEventDocument",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isEventDocument)
		collection.Schema.AddField(del_isEventDocument)

		// add
		del_isFullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kqh3lulz",
			"name": "isFullDocument",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isFullDocument)
		collection.Schema.AddField(del_isFullDocument)

		// add
		del_isClass := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "zdkxmyir",
			"name": "isClass",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isClass)
		collection.Schema.AddField(del_isClass)

		// add
		del_isCourse := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xvyswwj4",
			"name": "isCourse",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_isCourse)
		collection.Schema.AddField(del_isCourse)

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
	})
}
