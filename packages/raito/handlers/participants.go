package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

func GetParticipatedEventDocuments(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "eventDocuments"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	queryStr := fmt.Sprintf(
		`SELECT ed.* %s
      FROM participants p
        INNER JOIN eventDocuments ed ON p.document = ed.document
        INNER JOIN documents userDocument ON p.document = userDocument.id
      WHERE p.person = '%s'`,
		selectArgs, userPersonId)

	return model.GetRequestHandler(app, c, queryStr, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedFullEventDocuments(app *pocketbase.PocketBase, c echo.Context) error {
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

	queryStr := fmt.Sprintf(
		`SELECT fd.* %s
      FROM participants p
        INNER JOIN fullDocuments fd ON p.document = fd.document
        INNER JOIN documents userDocument ON p.document = userDocument.id
      WHERE p.person = '%s'`,
		selectArgs, userPersonId)

	return model.GetRequestHandler(app, c, queryStr, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetAllAcrossParticipants(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "people"
	hasGroupBy := true
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("relationships", "relationship", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("fullDocuments", "fullDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("eventDocuments", "eventDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	queryStr := fmt.Sprintf(
		`SELECT ppl.* %s
      FROM participants p
          INNER JOIN documents userDocument ON p.document == userDocument.id AND userDocument.owner = '%s'
          INNER JOIN people ppl ON p.person == ppl.id
          LEFT JOIN relationships relationship ON FALSE
          LEFT JOIN fullDocuments fullDocument ON p.document == fullDocument.document
          LEFT JOIN eventDocuments eventDocument ON p.document == eventDocument.document
      GROUP BY ppl.id`,
		selectArgs, userPersonId)

	return model.GetRequestHandler(app, c, queryStr, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetStarredParticipants(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "people"
	hasGroupBy := true
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("relationships", "relationship", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("fullDocuments", "fullDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("eventDocuments", "eventDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	queryStr := fmt.Sprintf(
		`SELECT ppl.* %s
      FROM relationships relationship
        INNER JOIN people ppl ON relationship.toPerson = ppl.id
        LEFT JOIN participants p ON relationship.toPerson = p.person
        LEFT JOIN fullDocuments fullDocument ON p.document == fullDocument.document
        LEFT JOIN eventDocuments eventDocument ON p.document == eventDocument.document
      WHERE fromPerson = '%s'
      GROUP BY ppl.id`,
		selectArgs, userPersonId)

	return model.GetRequestHandler(app, c, queryStr, mainCollectionName, hasGroupBy, fieldMetadataList)
}
