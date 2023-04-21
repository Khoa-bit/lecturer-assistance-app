package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
)

func GetFullDocuments(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "fullDocuments"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT fullDocument.* %s
    FROM (
      SELECT d.*
      FROM users AS u
        INNER JOIN documents AS d ON d.owner = u.person AND d.deleted == ''
      WHERE u.id='%s'
      ) as userDocument
      INNER JOIN fullDocuments AS fullDocument ON fullDocument.document = userDocument.id AND fullDocument.internal != 'Event'`,
		selectArgs, authRecord.Id))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetHasWriteFullDocuments(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "fullDocuments"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT fullDocument.* %s
      FROM documents userDocument
        LEFT JOIN participants participants ON participants.document = userDocument.id AND participants.person = {:userPersonId}
        LEFT JOIN fullDocuments fullDocument ON fullDocument.document = userDocument.id
      WHERE (userDocument.owner = {:userPersonId} OR participants.person = {:userPersonId}) AND fullDocument.internal != 'Event' AND userDocument.deleted == ''`,
		selectArgs))

	query.Bind(dbx.Params{"userPersonId": userPersonId})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
