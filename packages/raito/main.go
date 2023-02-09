package main

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"

	_ "raito-pocketbase/migrations"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

// DefaultPerPage specifies the default returned search result items.
const DefaultPerPage int = 30

// MaxPerPage specifies the maximum allowed search result items returned in a single page.
const MaxPerPage int = 500

// Result defines the returned search result structure.
type Result struct {
	Page       int `json:"page"`
	PerPage    int `json:"perPage"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
	Items      any `json:"items"`
}

type Datatype int

const (
	STRING Datatype = iota
	INT    Datatype = iota
	BOOL   Datatype = iota
)

type FieldMetaData struct {
	Column string
	Alias  string
	Datatype
}

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: true, // auto creates migration files when making collection changes
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		subGroup := e.Router.Group(
			"/api/user",
			apis.ActivityLogger(app),
		)

		subGroup.GET("/eventDocuments", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			// TODO: Implement API Rules
			query := *app.Dao().ParamQuery().
				Select("*").
				From("users u").
				InnerJoin("participants p", dbx.NewExp("p.person = u.person")).
				InnerJoin("eventDocuments e", dbx.NewExp("e.document = p.document")).
				InnerJoin("documents d", dbx.NewExp("d.id = e.document")).Where(dbx.HashExp{"u.id": authRecord.Id})
			if err != nil {
				return err
			}

			// count
			var totalCount int64
			countQuery := query
			countQuery.Distinct(false).Select("COUNT(*)").OrderBy() // unset ORDER BY statements
			if err := countQuery.Row(&totalCount); err != nil {
				return err
			}

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			query.Limit(int64(perPage))
			query.Offset(int64(perPage * (page - 1)))

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query.All(&items); err != nil {
				return err
			}

			// parse rawItems into formatted results by collection schemas
			eventDocumentsCollection, err := app.Dao().FindCollectionByNameOrId("eventDocuments")
			if err != nil {
				return err
			}
			documentsCollection, err := app.Dao().FindCollectionByNameOrId("documents")
			if err != nil {
				return err
			}

			eventDocumentsResults := models.NewRecordsFromNullStringMaps(eventDocumentsCollection, items)
			documentsResults := models.NewRecordsFromNullStringMaps(documentsCollection, items)

			// set expands
			for index, eventDoc := range eventDocumentsResults {
				eventDoc.SetExpand(map[string]any{
					"document": documentsResults[index].ColumnValueMap(),
				})
			}

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), eventDocumentsResults)
			apis.EnrichRecords(c, app.Dao(), documentsResults)

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      eventDocumentsResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		subGroup.GET("/fullDocuments", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			// TODO: Implement API Rules
			query := *app.Dao().ParamQuery().
				Select("*").
				From("users u").
				InnerJoin("participants p", dbx.NewExp("p.person = u.person")).
				InnerJoin("fullDocuments f", dbx.NewExp("f.document = p.document")).
				InnerJoin("documents d", dbx.NewExp("d.id = f.document")).Where(dbx.HashExp{"u.id": authRecord.Id})
			if err != nil {
				return err
			}

			// count
			var totalCount int64
			countQuery := query
			countQuery.Distinct(false).Select("COUNT(*)").OrderBy() // unset ORDER BY statements
			if err := countQuery.Row(&totalCount); err != nil {
				return err
			}

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			query.Limit(int64(perPage))
			query.Offset(int64(perPage * (page - 1)))

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query.All(&items); err != nil {
				return err
			}

			// parse rawItems into formatted results by collection schemas
			fullDocumentsCollection, err := app.Dao().FindCollectionByNameOrId("fullDocuments")
			if err != nil {
				return err
			}
			documentsCollection, err := app.Dao().FindCollectionByNameOrId("documents")
			if err != nil {
				return err
			}

			fullDocumentsResults := models.NewRecordsFromNullStringMaps(fullDocumentsCollection, items)
			documentsResults := models.NewRecordsFromNullStringMaps(documentsCollection, items)

			// set expands
			for index, eventDoc := range fullDocumentsResults {
				eventDoc.SetExpand(map[string]any{
					"document": documentsResults[index].ColumnValueMap(),
				})
			}

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), fullDocumentsResults)
			apis.EnrichRecords(c, app.Dao(), documentsResults)

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      fullDocumentsResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		subGroup.GET("/classes", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			// TODO: Implement API Rules
			query := *app.Dao().ParamQuery().
				Select("*").
				From("users u").
				InnerJoin("participants p", dbx.NewExp("p.person = u.person")).
				InnerJoin("classes c", dbx.NewExp("c.document = p.document")).
				InnerJoin("documents d", dbx.NewExp("d.id = c.document")).Where(dbx.HashExp{"u.id": authRecord.Id})
			if err != nil {
				return err
			}

			// count
			var totalCount int64
			countQuery := query
			countQuery.Distinct(false).Select("COUNT(*)").OrderBy() // unset ORDER BY statements
			if err := countQuery.Row(&totalCount); err != nil {
				return err
			}

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			query.Limit(int64(perPage))
			query.Offset(int64(perPage * (page - 1)))

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query.All(&items); err != nil {
				return err
			}

			// parse rawItems into formatted results by collection schemas
			classesCollection, err := app.Dao().FindCollectionByNameOrId("classes")
			if err != nil {
				return err
			}
			documentsCollection, err := app.Dao().FindCollectionByNameOrId("documents")
			if err != nil {
				return err
			}

			classesResults := models.NewRecordsFromNullStringMaps(classesCollection, items)
			documentsResults := models.NewRecordsFromNullStringMaps(documentsCollection, items)

			// set expands
			for index, eventDoc := range classesResults {
				eventDoc.SetExpand(map[string]any{
					"document": documentsResults[index].ColumnValueMap(),
				})
			}

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), classesResults)
			apis.EnrichRecords(c, app.Dao(), documentsResults)

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      classesResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		subGroup.GET("/courses", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			// TODO: Implement API Rules
			query := *app.Dao().ParamQuery().
				Select("*").
				From("users u").
				InnerJoin("participants p", dbx.NewExp("p.person = u.person")).
				InnerJoin("courses c", dbx.NewExp("c.document = p.document")).
				InnerJoin("documents d", dbx.NewExp("d.id = c.document")).Where(dbx.HashExp{"u.id": authRecord.Id})
			if err != nil {
				return err
			}

			// count
			var totalCount int64
			countQuery := query
			countQuery.Distinct(false).Select("COUNT(*)").OrderBy() // unset ORDER BY statements
			if err := countQuery.Row(&totalCount); err != nil {
				return err
			}

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			query.Limit(int64(perPage))
			query.Offset(int64(perPage * (page - 1)))

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query.All(&items); err != nil {
				return err
			}

			// parse rawItems into formatted results by collection schemas
			coursesCollection, err := app.Dao().FindCollectionByNameOrId("courses")
			if err != nil {
				return err
			}
			documentsCollection, err := app.Dao().FindCollectionByNameOrId("documents")
			if err != nil {
				return err
			}

			coursesResults := models.NewRecordsFromNullStringMaps(coursesCollection, items)
			documentsResults := models.NewRecordsFromNullStringMaps(documentsCollection, items)

			// set expands
			for index, eventDoc := range coursesResults {
				eventDoc.SetExpand(map[string]any{
					"document": documentsResults[index].ColumnValueMap(),
				})
			}

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), coursesResults)
			apis.EnrichRecords(c, app.Dao(), documentsResults)

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      coursesResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		subGroup.GET("/courses2", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			// TODO: Implement API Rules
			query := *app.Dao().ParamQuery().
				Select("*").
				From(`(
          SELECT *
          FROM users AS u
          INNER JOIN participants AS p ON p.person = u.person
          INNER JOIN courses AS c ON c.document = p.document
          INNER JOIN documents AS d ON d.id = c.document
          WHERE u.id='` + authRecord.Id + `'
        )`)
			if err != nil {
				return err
			}

			// count
			var totalCount int64
			countQuery := query
			countQuery.Distinct(false).Select("COUNT(*)").OrderBy() // unset ORDER BY statements
			if err := countQuery.Row(&totalCount); err != nil {
				return err
			}

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			query.Limit(int64(perPage))
			query.Offset(int64(perPage * (page - 1)))

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query.All(&items); err != nil {
				return err
			}

			// parse rawItems into formatted results by collection schemas
			coursesCollection, err := app.Dao().FindCollectionByNameOrId("courses")
			if err != nil {
				return err
			}
			documentsCollection, err := app.Dao().FindCollectionByNameOrId("documents")
			if err != nil {
				return err
			}

			coursesResults := models.NewRecordsFromNullStringMaps(coursesCollection, items)
			documentsResults := models.NewRecordsFromNullStringMaps(documentsCollection, items)

			// set expands
			for index, eventDoc := range coursesResults {
				eventDoc.SetExpand(map[string]any{
					"document": documentsResults[index].ColumnValueMap(),
				})
			}

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), coursesResults)
			apis.EnrichRecords(c, app.Dao(), documentsResults)

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      coursesResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		subGroup.GET("/contacts", func(c echo.Context) error {
			// Only auth records can access this endpoint
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			var err error

			mainCollectionName := "people"
			isGroupBy := true
			fieldMetadataList := []FieldMetaData{
				{"userDocument.id", "document_id_list", STRING},
				{"userDocument.name", "document_name_list", STRING},
				{"p.permission", "participant_permission_list", STRING},
				{"p.owner", "participant_owner_boolean_list", BOOL},
				{"p.role", "participant_role_list", STRING},
			}

			selectBuilder := strings.Builder{}
			for _, metadata := range fieldMetadataList {
				if isGroupBy {
					selectBuilder.WriteString(fmt.Sprintf(", GROUP_CONCAT(%s, ', ') AS %s", metadata.Column, metadata.Alias))
				} else {
					selectBuilder.WriteString(fmt.Sprintf(", %s AS %s", metadata.Column, metadata.Alias))
				}
			}

			// TODO: Implement API Rules
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
				selectBuilder.String(), authRecord.Id)

			query2 := app.Dao().DB().NewQuery(queryStr)

			// fetch models
			items := []dbx.NullStringMap{}
			if err := query2.All(&items); err != nil {
				return err
			}

			// Custom after-SQL call hook
			// to merge documents into "expand" for each unique people
			log.Println("============================")
			log.Println(items)
			log.Println("============================")

			// count
			totalCount := len(items)

			// normalize perPage
			perPageQueryParam := c.QueryParam("perPage")
			perPage, err := strconv.Atoi(perPageQueryParam)
			if err != nil || perPage <= 0 {
				perPage = DefaultPerPage
			} else if perPage > MaxPerPage {
				perPage = MaxPerPage
			}

			totalPages := int(math.Ceil(float64(totalCount) / float64(perPage)))

			// normalize page according to the total count
			pageQueryParam := c.QueryParam("page")
			page, err := strconv.Atoi(pageQueryParam)
			if err != nil || page <= 0 || totalCount == 0 {
				page = 1
			} else if page > totalPages {
				page = totalPages
			}

			// apply pagination
			startPage := (page - 1) * perPage
			endPage := int(math.Min(float64(totalCount), float64(startPage+perPage)))
			paginatedItems := items[startPage:endPage]

			// parse rawItems into formatted results by collection schemas
			mainCollection, err := app.Dao().FindCollectionByNameOrId(mainCollectionName)
			if err != nil {
				return err
			}

			mainResults := models.NewRecordsFromNullStringMaps(mainCollection, paginatedItems)

			// Enrich results with expands relations and api rules + visibility
			apis.EnrichRecords(c, app.Dao(), mainResults)

			// set expands
			for index, item := range mainResults {
				if item.Id != paginatedItems[index]["id"].String {
					return fmt.Errorf("expanding mismatch in collection '%s' at record id '%s'", mainCollectionName, item.Id)
				}

				expand := make(map[string]any, len(fieldMetadataList))
				for _, metadata := range fieldMetadataList {
					expandValue := paginatedItems[index][metadata.Alias].String
					if isGroupBy {
						expand[metadata.Alias] = convertListString(metadata.Datatype, expandValue)
					} else {
						expand[metadata.Alias] = convertString(metadata.Datatype, expandValue)
					}
				}

				item.SetExpand(expand)
			}

			result := &Result{
				Page:       page,
				PerPage:    perPage,
				TotalItems: int(totalCount),
				TotalPages: totalPages,
				Items:      mainResults,
			}

			return c.JSON(http.StatusOK, result)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func convertListString(datatype Datatype, valueStringConcat string) []any {
	valueStringList := strings.Split(valueStringConcat, ", ")
	resultList := make([]any, len(valueStringList))
	for index, valueString := range valueStringList {
		resultList[index] = convertString(datatype, valueString)
	}
	return resultList
}

func convertString(datatype Datatype, valueString string) any {
	var (
		result any
		err    error
	)
	switch datatype {
	case INT:
		result, err = strconv.Atoi(valueString)
	case BOOL:
		result, err = strconv.ParseBool(valueString)
	case STRING:
		fallthrough
	default:
		result = valueString
	}

	if err != nil {
		return err
	}

	return result
}
