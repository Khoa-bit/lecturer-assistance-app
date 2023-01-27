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
			"id": "e8b4edpfxo6tszo",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "attachments",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "c92e80nh",
					"name": "file",
					"type": "file",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"maxSize": 5242880,
						"mimeTypes": [],
						"thumbs": []
					}
				},
				{
					"system": false,
					"id": "yyzvvscf",
					"name": "document",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "j4ausx28rc681dq",
						"cascadeDelete": false
					}
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

		collection, err := dao.FindCollectionByNameOrId("e8b4edpfxo6tszo")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
