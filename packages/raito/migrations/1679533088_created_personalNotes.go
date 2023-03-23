package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "fewbiz09m7bi4kg",
			"created": "2023-03-23 00:58:08.847Z",
			"updated": "2023-03-23 00:58:08.847Z",
			"name": "personalNotes",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "xu7lw6et",
					"name": "fullDocument",
					"type": "relation",
					"required": true,
					"unique": true,
					"options": {
						"maxSelect": 1,
						"collectionId": "gcqfd846lugrlnj",
						"cascadeDelete": true
					}
				}
			],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fewbiz09m7bi4kg")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
