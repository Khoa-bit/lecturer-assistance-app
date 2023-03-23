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

		collection.ViewRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"read\" ||\n    @collection.participants.permission ?= \"comment\" ||\n    @collection.participants.permission ?= \"write\"\n  )\n)")

		collection.CreateRule = types.Pointer("@request.auth.person.id = document.owner.id || (\n  @collection.participants.document.id ?= document.id &&\n  @collection.participants.person.id ?= @request.auth.person.id && (\n    @collection.participants.permission ?= \"write\"\n  )\n)")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("gcqfd846lugrlnj")
		if err != nil {
			return err
		}

		collection.ViewRule = nil

		collection.CreateRule = nil

		return dao.SaveCollection(collection)
	})
}
