package handlers

import (
	"fmt"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"

	"raito-pocketbase/handlers/model"

	"github.com/pocketbase/pocketbase"
)

func GetPersonIdCollisions(app *pocketbase.PocketBase, c echo.Context, studentIDsString string) (*model.Result, error) {
	mainCollectionName := "people"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT p.* %s
    FROM people p
    WHERE p.personId IN (%s)`,
		selectArgs, studentIDsString))

	//query.Bind(dbx.Params{"docId": docId})
	var items []dbx.NullStringMap
	if err := query.All(&items); err != nil {
		return nil, err
	}

	return model.GetHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
