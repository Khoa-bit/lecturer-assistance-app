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

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("")

		json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `__pb_users_auth__created_idx` + "`" + ` ON ` + "`" + `users` + "`" + ` (` + "`" + `created` + "`" + `)",
			"CREATE UNIQUE INDEX ` + "`" + `idx_unique_tjtkcplz` + "`" + ` ON ` + "`" + `users` + "`" + ` (` + "`" + `person` + "`" + `)"
		]`), &collection.Indexes)

		// update
		edit_person := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tjtkcplz",
			"name": "person",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), edit_person)
		collection.Schema.AddField(edit_person)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `__pb_users_auth__created_idx` + "`" + ` ON ` + "`" + `users` + "`" + ` (` + "`" + `created` + "`" + `)",
			"CREATE UNIQUE INDEX \"idx_unique_tjtkcplz\" on \"users\" (\"person\")"
		]`), &collection.Indexes)

		// update
		edit_person := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "tjtkcplz",
			"name": "person",
			"type": "relation",
			"required": true,
			"unique": true,
			"options": {
				"collectionId": "vks6ezu0clb3qja",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), edit_person)
		collection.Schema.AddField(edit_person)

		return dao.SaveCollection(collection)
	})
}
