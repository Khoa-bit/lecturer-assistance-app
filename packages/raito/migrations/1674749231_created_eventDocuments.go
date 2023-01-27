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
			"id": "fdvpbps19x0r7r0",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "eventDocuments",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "t8r5f5g8",
					"name": "document",
					"type": "relation",
					"required": true,
					"unique": true,
					"options": {
						"maxSelect": 1,
						"collectionId": "j4ausx28rc681dq",
						"cascadeDelete": true
					}
				},
				{
					"system": false,
					"id": "tha3swja",
					"name": "fullDocument",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "gcqfd846lugrlnj",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "onmc3kts",
					"name": "startTime",
					"type": "date",
					"required": true,
					"unique": false,
					"options": {
						"min": "",
						"max": ""
					}
				},
				{
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
				},
				{
					"system": false,
					"id": "bece22zk",
					"name": "recurring",
					"type": "bool",
					"required": false,
					"unique": false,
					"options": {}
				}
			],
			"listRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"read\" || @collection.participants.permission = \"comment\" || @collection.participants.permission = \"write\")",
			"viewRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"read\" || @collection.participants.permission = \"comment\" || @collection.participants.permission = \"write\")",
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

		collection, err := dao.FindCollectionByNameOrId("fdvpbps19x0r7r0")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
