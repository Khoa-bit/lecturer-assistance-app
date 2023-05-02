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
		new_experience := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ghrmhhh1",
			"name": "experience",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_experience)
		collection.Schema.AddField(new_experience)

		// add
		new_education := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "02ey32bi",
			"name": "education",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_education)
		collection.Schema.AddField(new_education)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("ghrmhhh1")

		// remove
		collection.Schema.RemoveField("02ey32bi")

		return dao.SaveCollection(collection)
	})
}
