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
			"id": "2vda8dzur6jhdxy",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "courses",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "rp94rzbl",
					"name": "courseTemplate",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "w1u7k3atie2fwvi",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "xccusokg",
					"name": "lecturer",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "4cqxbw8kab49ay5",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "mk7oodyt",
					"name": "semester",
					"type": "text",
					"required": true,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "vtbu4ebk",
					"name": "document",
					"type": "relation",
					"required": true,
					"unique": true,
					"options": {
						"maxSelect": 1,
						"collectionId": "j4ausx28rc681dq",
						"cascadeDelete": true
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

		collection, err := dao.FindCollectionByNameOrId("2vda8dzur6jhdxy")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
