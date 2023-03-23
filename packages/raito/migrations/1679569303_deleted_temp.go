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

		collection, err := dao.FindCollectionByNameOrId("6h0ngwmqmx7ikjz")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	}, func(db dbx.Builder) error {
		jsonData := `{
			"id": "6h0ngwmqmx7ikjz",
			"created": "2023-01-28 03:24:51.186Z",
			"updated": "2023-01-28 17:32:51.842Z",
			"name": "temp",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "0nii0ykf",
					"name": "name",
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
					"id": "v4ns7vdn",
					"name": "person",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "vks6ezu0clb3qja",
						"cascadeDelete": false
					}
				}
			],
			"listRule": "",
			"viewRule": "",
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
	})
}
