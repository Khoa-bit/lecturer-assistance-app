package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
)

func GetAcademicMaterials(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "academicMaterials"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("fullDocuments", "fullDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT academicMaterial.* %s
    FROM (
      SELECT d.*
      FROM users AS u
        INNER JOIN documents AS d ON d.owner = u.person AND d.deleted == ''
      WHERE u.id='%s'
      ) as userDocument
      INNER JOIN fullDocuments AS fullDocument ON userDocument.id = fullDocument.document
      INNER JOIN academicMaterials AS academicMaterial ON fullDocument.id = academicMaterial.fullDocument`,
		selectArgs, authRecord.Id))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetAcademicMaterialsWithParticipants(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	userPersonId := authRecord.GetString("person")

	mainCollectionName := "documents"
	hasGroupBy := true
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("people", "person", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("academicMaterials", "academicMaterial", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT userDocument.* %s
      FROM
          (
              SELECT
                  userDocument.*
              FROM
                  documents userDocument
              WHERE userDocument.owner = {:userPersonId}
              UNION
              SELECT
                  userDocument.*
              FROM
                  participants p
                  INNER JOIN documents userDocument ON p.document = userDocument.id
                  AND userDocument.deleted == ''
              WHERE p.person = {:userPersonId}
          ) AS userDocument
          INNER JOIN participants participant ON participant.document = userDocument.id
          INNER JOIN people person ON person.id = participant.person
          INNER JOIN fullDocuments fullDocument ON fullDocument.document = userDocument.id AND fullDocument.internal = 'Academic material'
          INNER JOIN academicMaterials academicMaterial ON academicMaterial.fullDocument = fullDocument.id
          GROUP BY userDocument.id`,
		selectArgs))

	query.Bind(dbx.Params{"userPersonId": userPersonId})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
