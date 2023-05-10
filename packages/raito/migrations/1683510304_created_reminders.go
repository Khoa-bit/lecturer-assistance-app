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
			"id": "wg26kw9i9qjmuoq",
			"created": "2023-05-08 01:45:04.463Z",
			"updated": "2023-05-08 01:45:04.463Z",
			"name": "reminders",
			"type": "view",
			"system": false,
			"schema": [
				{
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
				},
				{
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
				},
				{
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
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"query": "SELECT ed.id, ed.fullDocument, ed.toFullDocument, ed.reminderAt\nFROM eventDocuments ed \nWHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()\n"
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("wg26kw9i9qjmuoq")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
