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

		// update
		edit_isFaculty := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "68gd2lrk",
			"name": "isFaculty",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), edit_isFaculty)
		collection.Schema.AddField(edit_isFaculty)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		// update
		edit_isFaculty := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "68gd2lrk",
			"name": "isLecturer",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), edit_isFaculty)
		collection.Schema.AddField(edit_isFaculty)

		return dao.SaveCollection(collection)
	})
}
