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
			"id": "j4ausx28rc681dq",
			"created": "2023-01-26 16:07:11.063Z",
			"updated": "2023-01-26 16:07:11.063Z",
			"name": "documents",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "2uoyxb26",
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
					"id": "1ek0nj8b",
					"name": "thumbnail",
					"type": "file",
					"required": false,
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
					"id": "6lbioxm6",
					"name": "category",
					"type": "select",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"International journals - Rank 1",
							"International journals - Rank 2",
							"International journals - Other",
							"National journals",
							"Monographs",
							"Curriculums",
							"Reference books",
							"Manual books",
							"Personal notes"
						]
					}
				},
				{
					"system": false,
					"id": "a1ot8na9",
					"name": "priority",
					"type": "select",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"Lower",
							"Low",
							"Medium",
							"High",
							"Higher"
						]
					}
				},
				{
					"system": false,
					"id": "dhueurhe",
					"name": "status",
					"type": "select",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"Todo",
							"In progress",
							"Review",
							"Done",
							"Closed"
						]
					}
				},
				{
					"system": false,
					"id": "lb6sjqrk",
					"name": "richText",
					"type": "json",
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

		collection, err := dao.FindCollectionByNameOrId("j4ausx28rc681dq")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
