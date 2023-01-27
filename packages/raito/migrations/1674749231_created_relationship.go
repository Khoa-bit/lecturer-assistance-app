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
			"id": "q22h280gruk59ry",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "relationship",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "4si6gxog",
					"name": "fromPerson",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "vks6ezu0clb3qja",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "uk38iicu",
					"name": "toPerson",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "vks6ezu0clb3qja",
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

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
