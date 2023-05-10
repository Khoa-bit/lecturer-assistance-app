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
			"id": "90muxdzyhmhxg4t",
			"created": "2023-05-07 17:57:59.357Z",
			"updated": "2023-05-07 17:57:59.357Z",
			"name": "reminders",
			"type": "view",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "jqg8obze",
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
				},
				{
					"system": false,
					"id": "tynulikw",
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
				},
				{
					"system": false,
					"id": "uvawweot",
					"name": "reminderAt",
					"type": "date",
					"required": false,
					"unique": false,
					"options": {
						"min": "",
						"max": ""
					}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"query": "SELECT ed.id, ed.fullDocument, ed.toFullDocument, ed.reminderAt \nFROM eventDocuments ed \nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()"
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("90muxdzyhmhxg4t")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
