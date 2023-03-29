package handlers

import (
	"fmt"

	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
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

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT eventDocument.* %s
      FROM participants p
        INNER JOIN fullDocuments AS fullDocument ON p.document = fullDocument.document
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
        INNER JOIN eventDocuments eventDocument ON fullDocument.id = eventDocument.toFullDocument
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedFullDocuments(app *pocketbase.PocketBase, c echo.Context) error {
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
		`SELECT fd.* %s
      FROM participants p
        INNER JOIN fullDocuments fd ON p.document = fd.document AND fd.internal != 'Event'
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedAcademicMaterials(app *pocketbase.PocketBase, c echo.Context) error {
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

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT academicMaterial.* %s
      FROM participants p
        INNER JOIN fullDocuments AS fullDocument ON p.document = fullDocument.document
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
        INNER JOIN academicMaterials academicMaterial ON fullDocument.id = academicMaterial.fullDocument
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedPersonalNotes(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "personalNotes"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT personalNote.* %s
      FROM participants p
        INNER JOIN fullDocuments AS fullDocument ON p.document = fullDocument.document
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
        INNER JOIN personalNotes personalNote ON fullDocument.id = personalNote.fullDocument
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedCourses(app *pocketbase.PocketBase, c echo.Context) error {
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
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT course.* %s
      FROM participants p
        INNER JOIN fullDocuments AS fullDocument ON p.document = fullDocument.document
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
        INNER JOIN courses course ON fullDocument.id = course.fullDocument
        INNER JOIN courseTemplates AS courseTemplate ON courseTemplate.id = course.courseTemplate
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetParticipatedClasses(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	mainCollectionName := "classes"
	hasGroupBy := false
	fieldMetadataList := model.FieldMetaDataList{}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("majors", "major", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT class.* %s
      FROM participants p
        INNER JOIN fullDocuments AS fullDocument ON p.document = fullDocument.document
        INNER JOIN documents userDocument ON p.document = userDocument.id AND userDocument.deleted == ''
        INNER JOIN classes class ON fullDocument.id = class.fullDocument
        INNER JOIN majors AS major ON major.id = class.major
      WHERE p.person = '%s'`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
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
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("participants", "participant", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "user", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendColumnAliases([]string{"user_email_list"}, []string{"string"})
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT ppl.*, GROUP_CONCAT(IIF(emailVisibility == 1, email, ''), ', ') as user_email_list %s
      FROM participants participant
          INNER JOIN documents userDocument ON participant.document == userDocument.id AND userDocument.deleted == '' AND userDocument.owner = '%s'
          INNER JOIN people ppl ON participant.person == ppl.id
          LEFT JOIN relationships relationship ON FALSE
          LEFT JOIN fullDocuments fullDocument ON participant.document == fullDocument.document
          LEFT JOIN eventDocuments eventDocument ON fullDocument.document == eventDocument.fullDocument
          LEFT JOIN users user ON user.person = ppl.id
      GROUP BY ppl.id`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
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
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("participants", "participant", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("users", "user", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendColumnAliases([]string{"user_email_list"}, []string{"string"})
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)
	userPersonId := authRecord.GetString("person")

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT ppl.*, GROUP_CONCAT(IIF(emailVisibility == 1, email, ''), ', ') as user_email_list %s
      FROM relationships relationship
        INNER JOIN people ppl ON relationship.toPerson = ppl.id
        LEFT JOIN participants participant ON relationship.toPerson = participant.person
        LEFT JOIN documents userDocument ON participant.document == userDocument.id AND userDocument.deleted == ''
        LEFT JOIN fullDocuments fullDocument ON participant.document == fullDocument.document
        LEFT JOIN eventDocuments eventDocument ON fullDocument.document == eventDocument.fullDocument
        LEFT JOIN users user ON user.person = ppl.id
      WHERE fromPerson = '%s'
      GROUP BY ppl.id`,
		selectArgs, userPersonId))

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetAllDocParticipation(app *pocketbase.PocketBase, c echo.Context) error {
	authRecord, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	toPerson := c.PathParam("toPerson")
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
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
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
		`SELECT ppl.* %s
      FROM participants participant
          INNER JOIN documents userDocument ON participant.document == userDocument.id AND userDocument.deleted == '' AND userDocument.owner = '%s'
          INNER JOIN people ppl ON participant.person == ppl.id
          LEFT JOIN relationships relationship ON FALSE
          LEFT JOIN fullDocuments fullDocument ON participant.document == fullDocument.document
          LEFT JOIN eventDocuments eventDocument ON fullDocument.document == eventDocument.fullDocument
      WHERE participant.person = {:toPerson}
      GROUP BY ppl.id`,
		selectArgs, userPersonId))

	query.Bind(dbx.Params{"toPerson": toPerson})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}

func GetAllDocParticipants(app *pocketbase.PocketBase, c echo.Context) error {
	_, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	docId := c.PathParam("docId")
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
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("documents", "userDocument", hasGroupBy, app)
	if err != nil {
		return err
	}
	fieldMetadataList, err = fieldMetadataList.AppendCollectionByNameOrId("participants", "participant", hasGroupBy, app)
	if err != nil {
		return err
	}

	selectArgs := model.BuildSelectArgs(fieldMetadataList, hasGroupBy)

	query := app.Dao().DB().NewQuery(fmt.Sprintf(
		`SELECT ppl.* %s
      FROM participants participant
          INNER JOIN documents userDocument ON participant.document == userDocument.id AND userDocument.deleted == '' AND userDocument.id == {:docId}
          INNER JOIN people ppl ON participant.person == ppl.id
          LEFT JOIN relationships relationship ON FALSE
          LEFT JOIN fullDocuments fullDocument ON participant.document == fullDocument.document
          LEFT JOIN eventDocuments eventDocument ON fullDocument.document == eventDocument.fullDocument
      GROUP BY ppl.id`,
		selectArgs))

	query.Bind(dbx.Params{"docId": docId})

	return model.GetRequestHandler(app, c, query, mainCollectionName, hasGroupBy, fieldMetadataList)
}
