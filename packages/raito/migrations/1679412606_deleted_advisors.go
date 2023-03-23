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
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("h82fixjy91ga7sw")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	}, func(db dbx.Builder) error {
		jsonData := `{
			"id": "h82fixjy91ga7sw",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-28 06:27:32.648Z",
			"name": "advisors",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "uecdpcd1",
					"name": "person",
					"type": "relation",
					"required": true,
					"unique": true,
					"options": {
						"maxSelect": 1,
						"collectionId": "vks6ezu0clb3qja",
						"cascadeDelete": true
					}
				}
			],
			"listRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"read\" || @collection.participants.permission = \"comment\" || @collection.participants.permission = \"write\")",
			"viewRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"read\" || @collection.participants.permission = \"comment\" || @collection.participants.permission = \"write\")",
			"createRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"write\")",
			"updateRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"write\")",
			"deleteRule": "@request.auth.person.id = @collection.participants.person.id && (@collection.participants.permission = \"write\")",
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	})
}
