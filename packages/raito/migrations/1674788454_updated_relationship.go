package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		collection.Name = "relationships"

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("q22h280gruk59ry")
		if err != nil {
			return err
		}

		collection.Name = "relationship"

		return dao.SaveCollection(collection)
	})
}
