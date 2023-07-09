package handlers

import (
	"fmt"
	"github.com/pocketbase/dbx"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

func GetEventDocuments(app *pocketbase.PocketBase, c echo.Context) error {
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
		`SELECT eventDocument.* %s
    FROM (
      SELECT d.*
      FROM users AS u
        INNER JOIN documents AS d ON d.owner = u.person AND d.deleted == ''
      WHERE u.id='%s'
      ) as userDocument
      INNER JOIN fullDocuments AS fullDocument ON userDocument.id = fullDocument.document
      INNER JOIN eventDocuments AS eventDocument ON fullDocument.id = eventDocument.fullDocument`,
		selectArgs, authRecord.Id))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetUpcomingEvents(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "eventDocuments"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("fullDocuments", "fullDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "document", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("participants", "participant", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT ed.* %s
    FROM eventDocuments ed
    INNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument
    INNER JOIN documents document ON document.id = fullDocument.document AND document.deleted == '' AND (document.endTime = '' OR document.endTime >= DATETIME())
    LEFT JOIN participants participant ON participant.document = document.id AND participant.person = {:userPersonId}
    WHERE document.owner = {:userPersonId} OR participant.person NOTNULL`,
		selectArgs))

	query.Bind(dbx.Params{"userPersonId": userPersonId})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetPastEvents(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "eventDocuments"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("fullDocuments", "fullDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "document", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("participants", "participant", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT ed.* %s
    FROM eventDocuments ed
    INNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument
    INNER JOIN documents document ON document.id = fullDocument.document AND document.deleted == '' AND (document.endTime <> '' AND document.endTime < DATETIME())
    LEFT JOIN participants participant ON participant.document = document.id AND participant.person = {:userPersonId}
    WHERE (document.owner = {:userPersonId} OR participant.person NOTNULL) AND ed.recurring = 'Once'`,
		selectArgs))

	query.Bind(dbx.Params{"userPersonId": userPersonId})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
