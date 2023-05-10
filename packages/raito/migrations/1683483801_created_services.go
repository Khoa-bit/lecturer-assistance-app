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
			"id": "4w4bken5gxfrj4j",
			"created": "2023-05-07 18:23:21.139Z",
			"updated": "2023-05-07 18:23:21.139Z",
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
				"allowEmailAuth": false,
				"allowOAuth2Auth": false,
				"allowUsernameAuth": true,
				"exceptEmailDomains": [],
				"manageRule": null,
				"minPasswordLength": 64,
				"onlyEmailDomains": [],
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

		collection, err := dao.FindCollectionByNameOrId("4w4bken5gxfrj4j")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
