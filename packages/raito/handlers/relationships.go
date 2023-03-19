package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

// get all relationships of the current auth user
func GetRelationships(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "relationships"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "fromUser", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "toUser", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("people", "toPerson", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT relationships.* %s
      FROM relationships
        INNER JOIN users fromUser ON relationships.fromPerson = fromUser.person AND fromUser.id = '%s'
        INNER JOIN people toPerson ON relationships.toPerson = toPerson.id
        LEFT JOIN users toUser ON relationships.toPerson = toUser.person`,
		selectArgs, authRecord.Id))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

// Get all people that the current auth user doesn't have relationships with
func GetNewRelationshipsOptions(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "relationships"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "fromUser", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "toUser", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("people", "toPerson", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT relationships.* %s
      FROM people toPerson
        LEFT JOIN relationships ON toPerson.id = relationships.toPerson
        AND relationships.fromPerson = '%s'
        LEFT JOIN users fromUser ON relationships.fromPerson = fromUser.person
        LEFT JOIN users toUser ON relationships.toPerson = toUser.person
      WHERE relationships.toPerson IS NULL AND toPerson.id <> '%s'`,
		selectArgs, userPersonId, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
