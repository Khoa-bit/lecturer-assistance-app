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
			"id": "s6k8xiqz09qxjd6",
			"created": "2023-05-08 01:41:33.273Z",
			"updated": "2023-05-08 01:41:33.273Z",
			"name": "services",
			"type": "auth",
			"system": false,
			"schema": [],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"allowEmailAuth": true,
				"allowOAuth2Auth": true,
				"allowUsernameAuth": true,
				"exceptEmailDomains": null,
				"manageRule": null,
				"minPasswordLength": 8,
				"onlyEmailDomains": null,
				"requireEmail": false
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("s6k8xiqz09qxjd6")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
