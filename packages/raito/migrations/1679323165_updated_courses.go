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

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		// update
		edit_courseTemplate := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rp94rzbl",
			"name": "courseTemplate",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "w1u7k3atie2fwvi",
				"cascadeDelete": false
			}
		}`), edit_courseTemplate)
		collection.Schema.AddField(edit_courseTemplate)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		// update
		edit_courseTemplate := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rp94rzbl",
			"name": "courseTemplate",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "w1u7k3atie2fwvi",
				"cascadeDelete": false
			}
		}`), edit_courseTemplate)
		collection.Schema.AddField(edit_courseTemplate)

		return dao.SaveCollection(collection)
	})
}
