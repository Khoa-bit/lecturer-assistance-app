package main

import (
	"log"

	"raito-pocketbase/handlers"
	_ "raito-pocketbase/migrations"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
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

		// Get all event documents
		subGroup.GET("/eventDocuments", func(c echo.Context) error {
			return handlers.GetEventDocuments(app, c)
		})

		// Get all event documents that the current user participate in
		subGroup.GET("/participatedEventDocuments", func(c echo.Context) error {
			return handlers.GetParticipatedEventDocuments(app, c)
		})

		// Get all full documents
		subGroup.GET("/fullDocuments", func(c echo.Context) error {
			return handlers.GetFullDocuments(app, c)
		})

		// Get all full documents that the current user participate in
		subGroup.GET("/participatedFullDocuments", func(c echo.Context) error {
			return handlers.GetParticipatedFullDocuments(app, c)
		})

		// Get all classes of the current user
		subGroup.GET("/classes", func(c echo.Context) error {
			return handlers.GetClasses(app, c)
		})

		// Get all event documents that the current user participate in
		subGroup.GET("/participatedClasses", func(c echo.Context) error {
			return handlers.GetParticipatedClasses(app, c)
		})

		// Get all courses of the current user
		subGroup.GET("/courses", func(c echo.Context) error {
			return handlers.GetCourses(app, c)
		})

		// Get all event documents that the current user participate in
		subGroup.GET("/participatedCourses", func(c echo.Context) error {
			return handlers.GetParticipatedCourses(app, c)
		})

		// Get all starred relationships with the current user
		subGroup.GET("/relationships", func(c echo.Context) error {
			return handlers.GetRelationships(app, c)
		})

		// Get all participants from the current user's documents
		subGroup.GET("/allAcrossParticipants", func(c echo.Context) error {
			return handlers.GetAllAcrossParticipants(app, c)
		})

		// Get all starred participants from the current user's documents
		subGroup.GET("/getStarredParticipants", func(c echo.Context) error {
			return handlers.GetStarredParticipants(app, c)
		})

		// Get all documents that the query person participate in the current user's document
		subGroup.GET("/getAllDocParticipation/:toPerson", func(c echo.Context) error {
			return handlers.GetAllDocParticipation(app, c)
		})

		// Get all participants for the current user's particular doc
		subGroup.GET("/getAllDocParticipants/:docId", func(c echo.Context) error {
			return handlers.GetAllDocParticipants(app, c)
		})

		// Get all possible new relationships options for the current user.
		// Deprecated since We don't need to add contact manually anymore - add star will automatically add new relationships
		subGroup.GET("/newRelationshipsOptions", func(c echo.Context) error {
			return handlers.GetNewRelationshipsOptions(app, c)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
