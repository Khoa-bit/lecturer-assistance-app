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
			"id": "ykaefycx2ie9dtn",
			"created": "2023-03-23 11:01:17.972Z",
			"updated": "2023-03-23 11:01:17.972Z",
			"name": "academicMaterials",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "js4r6fcc",
					"name": "category",
					"type": "select",
					"required": true,
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
							"Draft"
						]
					}
				},
				{
					"system": false,
					"id": "gy4j389h",
					"name": "fullDocument",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"collectionId": "gcqfd846lugrlnj",
						"cascadeDelete": true
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

		collection, err := dao.FindCollectionByNameOrId("ykaefycx2ie9dtn")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
