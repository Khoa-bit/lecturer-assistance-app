package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

func GetContacts(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "people"
	hasGroupBy := true
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	queryStr := fmt.Sprintf(
		`SELECT ppl.* %s
    FROM (
      SELECT d.*
      FROM users AS u
        INNER JOIN participants AS p ON p.person = u.person
        INNER JOIN documents AS d ON d.id = p.document
      WHERE u.id='%s'
      ) as userDocument
      INNER JOIN participants AS p ON p.document = userDocument.id
      INNER JOIN people AS ppl ON p.person = ppl.id
    GROUP BY ppl.id`,
		selectArgs, authRecord.Id)

	return model.GetRequestHandler(app, c, queryStr, mainCollectionName, hasGroupBy, fieldMetadataList)
}
