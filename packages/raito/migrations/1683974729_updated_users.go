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

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// add
		new_justRegistered := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "5opldxlb",
			"name": "justRegistered",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_justRegistered)
		collection.Schema.AddField(new_justRegistered)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("5opldxlb")

		return dao.SaveCollection(collection)
	})
}
