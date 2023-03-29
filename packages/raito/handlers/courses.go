package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

func GetCourses(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "courses"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("courseTemplates", "courseTemplate", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT course.* %s
    FROM (
      SELECT d.*
      FROM users AS u
        INNER JOIN documents AS d ON d.owner = u.person AND d.deleted == ''
      WHERE u.id='%s'
      ) as userDocument
      INNER JOIN fullDocuments AS fullDocument ON userDocument.id = fullDocument.document
      INNER JOIN courses AS course ON fullDocument.id = course.fullDocument
      INNER JOIN courseTemplates AS courseTemplate ON courseTemplate.id = course.courseTemplate`,
		selectArgs, authRecord.Id))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
