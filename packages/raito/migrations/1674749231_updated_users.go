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

		// remove
		collection.Schema.RemoveField("users_name")

		// remove
		collection.Schema.RemoveField("users_avatar")

		// add
		new_person := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tjtkcplz",
			"name": "person",
			"type": "relation",
			"required": true,
			"unique": true,
			"options": {
				"maxSelect": 1,
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": true
			}
		}`), new_person)
		collection.Schema.AddField(new_person)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// add
		del_name := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "users_name",
			"name": "name",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_name)
		collection.Schema.AddField(del_name)

		// add
		del_avatar := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "users_avatar",
			"name": "avatar",
			"type": "file",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"maxSize": 5242880,
				"mimeTypes": [
					"image/jpg",
					"image/jpeg",
					"image/png",
					"image/svg+xml",
					"image/gif",
					"image/webp"
				],
				"thumbs": null
			}
		}`), del_avatar)
		collection.Schema.AddField(del_avatar)

		// remove
		collection.Schema.RemoveField("tjtkcplz")

		return dao.SaveCollection(collection)
	})
}
