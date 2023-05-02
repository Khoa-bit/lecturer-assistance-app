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

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `_fdvpbps19x0r7r0_created_idx` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `created` + "`" + `)",
			"CREATE UNIQUE INDEX ` + "`" + `idx_unique_tha3swja` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `fullDocument` + "`" + `)"
		]`), &collection.Indexes)

		// remove
		collection.Schema.RemoveField("onmc3kts")

		// remove
		collection.Schema.RemoveField("ms8hojja")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `_fdvpbps19x0r7r0_created_idx` + "`" + ` ON ` + "`" + `eventDocuments` + "`" + ` (` + "`" + `created` + "`" + `)",
			"CREATE UNIQUE INDEX \"idx_unique_tha3swja\" on \"eventDocuments\" (\"fullDocument\")"
		]`), &collection.Indexes)

		// add
		del_startTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "onmc3kts",
			"name": "startTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_startTime)
		collection.Schema.AddField(del_startTime)

		// add
		del_endTime := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ms8hojja",
			"name": "endTime",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), del_endTime)
		collection.Schema.AddField(del_endTime)

		return dao.SaveCollection(collection)
	})
}
