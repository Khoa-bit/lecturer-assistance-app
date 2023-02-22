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

		collection, err := dao.FindCollectionByNameOrId("d1gfoputrdow7mx")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("l4uzrvdm")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("d1gfoputrdow7mx")
		if err != nil {
			return err
		}

		// add
		del_owner := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "l4uzrvdm",
			"name": "owner",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_owner)
		collection.Schema.AddField(del_owner)

		return dao.SaveCollection(collection)
	})
}
