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
			"id": "d1gfoputrdow7mx",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "participants",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "227i0wxj",
					"name": "permission",
					"type": "select",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"read",
							"comment",
							"write"
						]
					}
				},
				{
					"system": false,
					"id": "l4uzrvdm",
					"name": "owner",
					"type": "bool",
					"required": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "cq6ifear",
					"name": "role",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "ranibkpo",
					"name": "note",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "bnhqtxmx",
					"name": "document",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "j4ausx28rc681dq",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "m5yykllq",
					"name": "person",
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

		collection, err := dao.FindCollectionByNameOrId("d1gfoputrdow7mx")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
