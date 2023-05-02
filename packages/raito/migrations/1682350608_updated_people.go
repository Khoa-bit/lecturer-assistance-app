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

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// add
		new_interests := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "g5ktnfs4",
			"name": "interests",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_interests)
		collection.Schema.AddField(new_interests)

		// add
		new_contactLocation := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1kwmlqmk",
			"name": "contactLocation",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_contactLocation)
		collection.Schema.AddField(new_contactLocation)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("g5ktnfs4")

		// remove
		collection.Schema.RemoveField("1kwmlqmk")

		return dao.SaveCollection(collection)
	})
}
