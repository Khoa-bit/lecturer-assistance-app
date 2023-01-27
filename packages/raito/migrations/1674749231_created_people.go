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
			"id": "vks6ezu0clb3qja",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "people",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "3url41zb",
					"name": "personId",
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
					"id": "rcllt17h",
					"name": "name",
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
					"id": "uobc2ok6",
					"name": "avatar",
					"type": "file",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"maxSize": 5242880,
						"mimeTypes": [
							"image/jpg",
							"image/jpeg",
							"image/png",
							"image/svg+xml",
							"image/gif",
							"image/webp"
						],
						"thumbs": []
					}
				},
				{
					"system": false,
					"id": "tqecd1dc",
					"name": "phone",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": "^\\d+$"
					}
				},
				{
					"system": false,
					"id": "scvvf02v",
					"name": "personalEmail",
					"type": "email",
					"required": false,
					"unique": false,
					"options": {
						"exceptDomains": null,
						"onlyDomains": null
					}
				},
				{
					"system": false,
					"id": "p9j3qlmc",
					"name": "title",
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
					"id": "ihzcpbqt",
					"name": "placeOfBirth",
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
					"id": "rvacb4gs",
					"name": "gender",
					"type": "select",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"Man",
							"Woman",
							"Non-Binary",
							"Not Listed"
						]
					}
				},
				{
					"system": false,
					"id": "y6l0vv3j",
					"name": "department",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "rncqe4klgabuo3x",
						"cascadeDelete": false
					}
				},
				{
					"system": false,
					"id": "fyjj6s2d",
					"name": "deleted",
					"type": "date",
					"required": false,
					"unique": false,
					"options": {
						"min": "",
						"max": ""
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

		collection, err := dao.FindCollectionByNameOrId("vks6ezu0clb3qja")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
