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

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// add
		new_isEventDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "p9giqklm",
			"name": "isEventDocument",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isEventDocument)
		collection.Schema.AddField(new_isEventDocument)

		// add
		new_isFullDocument := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kqh3lulz",
			"name": "isFullDocument",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isFullDocument)
		collection.Schema.AddField(new_isFullDocument)

		// add
		new_isClass := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "zdkxmyir",
			"name": "isClass",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isClass)
		collection.Schema.AddField(new_isClass)

		// add
		new_isCourse := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xvyswwj4",
			"name": "isCourse",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_isCourse)
		collection.Schema.AddField(new_isCourse)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("p9giqklm")

		// remove
		collection.Schema.RemoveField("kqh3lulz")

		// remove
		collection.Schema.RemoveField("zdkxmyir")

		// remove
		collection.Schema.RemoveField("xvyswwj4")

		return dao.SaveCollection(collection)
	})
}
