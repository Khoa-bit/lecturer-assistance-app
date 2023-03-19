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

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @request.auth.person.id = @collection.participants.person.id && (\n    @collection.participants.permission = \"read\" ||\n    @collection.participants.permission = \"comment\" ||\n    @collection.participants.permission = \"write\"))")

		collection.ViewRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @request.auth.person.id = @collection.participants.person.id && (\n    @collection.participants.permission = \"read\" ||\n    @collection.participants.permission = \"comment\" ||\n    @collection.participants.permission = \"write\"))")

		collection.UpdateRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @request.auth.person.id = @collection.participants.person.id && (\n    @collection.participants.permission = \"comment\" ||\n    @collection.participants.permission = \"write\"))")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		collection.ViewRule = nil

		collection.UpdateRule = nil

		return dao.SaveCollection(collection)
	})
}
