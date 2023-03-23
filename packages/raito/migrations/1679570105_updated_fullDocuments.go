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

		// remove
		collection.Schema.RemoveField("1xozu39q")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		// add
		del_category := &schema.SchemaField{}
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
		}`), del_category)
		collection.Schema.AddField(del_category)

		return dao.SaveCollection(collection)
	})
}
