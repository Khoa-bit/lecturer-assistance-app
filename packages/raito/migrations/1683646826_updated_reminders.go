package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("wg26kw9i9qjmuoq")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("@collection.services.id ?= @request.auth.id")

		collection.ViewRule = types.Pointer("@collection.services.id ?= @request.auth.id")

		// remove
		collection.Schema.RemoveField("vj9jpd1d")

		// remove
		collection.Schema.RemoveField("psbposcj")

		// remove
		collection.Schema.RemoveField("xunlcia4")

		// add
		new_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mu7whxwk",
			"name": "fullDocument",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_fullDocument)
		collection.Schema.AddField(new_fullDocument)

		// add
		new_toFullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "jszix8tm",
			"name": "toFullDocument",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_toFullDocument)
		collection.Schema.AddField(new_toFullDocument)

		// add
		new_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "fnntdlhx",
			"name": "reminderAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), new_reminderAt)
		collection.Schema.AddField(new_reminderAt)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("wg26kw9i9qjmuoq")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		collection.ViewRule = nil

		// add
		del_fullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "vj9jpd1d",
			"name": "fullDocument",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_fullDocument)
		collection.Schema.AddField(del_fullDocument)

		// add
		del_toFullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "psbposcj",
			"name": "toFullDocument",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "gcqfd846lugrlnj",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_toFullDocument)
		collection.Schema.AddField(del_toFullDocument)

		// add
		del_reminderAt := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xunlcia4",
			"name": "reminderAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_reminderAt)
		collection.Schema.AddField(del_reminderAt)

		// remove
		collection.Schema.RemoveField("mu7whxwk")

		// remove
		collection.Schema.RemoveField("jszix8tm")

		// remove
		collection.Schema.RemoveField("fnntdlhx")

		return dao.SaveCollection(collection)
	})
}
