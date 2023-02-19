package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("e8b4edpfxo6tszo")
		if err != nil {
			return err
		}

		collection.DeleteRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @request.auth.person.id = @collection.participants.person.id && @collection.participants.permission = \"write\")")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("e8b4edpfxo6tszo")
		if err != nil {
			return err
		}

		collection.DeleteRule = nil

		return dao.SaveCollection(collection)
	})
}
