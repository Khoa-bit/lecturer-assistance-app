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

		// remove
		collection.Schema.RemoveField("tfuuyuab")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("lbkbtnakhaudvls")
		if err != nil {
			return err
		}

		// add
		del_advisor := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tfuuyuab",
			"name": "advisor",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"collectionId": "h82fixjy91ga7sw",
				"cascadeDelete": false
			}
		}`), del_advisor)
		collection.Schema.AddField(del_advisor)

		return dao.SaveCollection(collection)
	})
}
