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

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("3f6segxj")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		// add
		del_testRichText := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3f6segxj",
			"name": "testRichText",
			"type": "editor",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_testRichText)
		collection.Schema.AddField(del_testRichText)

		return dao.SaveCollection(collection)
	})
}
