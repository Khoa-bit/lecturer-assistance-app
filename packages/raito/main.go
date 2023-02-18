package main

import (
	"log"
	"math"
	"net/http"
	"strconv"

	"raito-pocketbase/handlers"
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
			return handlers.GetFullDocuments(app, c)
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
			return handlers.GetContacts(app, c)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
