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

		// remove
		collection.Schema.RemoveField("xccusokg")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		// add
		del_lecturer := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xccusokg",
			"name": "lecturer",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "4cqxbw8kab49ay5",
				"cascadeDelete": false
			}
		}`), del_lecturer)
		collection.Schema.AddField(del_lecturer)

		return dao.SaveCollection(collection)
	})
}
