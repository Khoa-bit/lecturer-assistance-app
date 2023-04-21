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
		// Deprecated since events page now show upcoming and part events
		subGroup.GET("/getEventDocuments", func(c echo.Context) error {
			return handlers.GetEventDocuments(app, c)
		})

		// Get all event documents that the current user participate in
		// Deprecated since events page now show upcoming and part events
		subGroup.GET("/getParticipatedEventDocuments", func(c echo.Context) error {
			return handlers.GetParticipatedEventDocuments(app, c)
		})

		// Get all user's full documents for event documents
		// Full documents is now shared base for other documents
		subGroup.GET("/fullDocuments", func(c echo.Context) error {
			return handlers.GetFullDocuments(app, c)
		})

		// Get all full documents that the current user participate in
		// Full documents is now shared base for other documents
		subGroup.GET("/participatedFullDocuments", func(c echo.Context) error {
			return handlers.GetParticipatedFullDocuments(app, c)
		})

    // Get all user's write-access full documents for event documents
		// Full documents is now shared base for other documents
		subGroup.GET("/getHasWriteFullDocuments", func(c echo.Context) error {
			return handlers.GetHasWriteFullDocuments(app, c)
		})

		// Get all academic materials
		subGroup.GET("/getAcademicMaterials", func(c echo.Context) error {
			return handlers.GetAcademicMaterials(app, c)
		})

		// Get all academic materials that the current user participate in
		subGroup.GET("/getParticipatedAcademicMaterials", func(c echo.Context) error {
			return handlers.GetParticipatedAcademicMaterials(app, c)
		})

		// Get all personalNotes of the current user
		subGroup.GET("/getPersonalNotes", func(c echo.Context) error {
			return handlers.GetPersonalNotes(app, c)
		})

		// Get all personalNotes that the current user participate in
		subGroup.GET("/getParticipatedPersonalNotes", func(c echo.Context) error {
			return handlers.GetParticipatedPersonalNotes(app, c)
		})

		// Get all classes of the current user
		subGroup.GET("/getClasses", func(c echo.Context) error {
			return handlers.GetClasses(app, c)
		})

		// Get all event documents that the current user participate in
		subGroup.GET("/getParticipatedClasses", func(c echo.Context) error {
			return handlers.GetParticipatedClasses(app, c)
		})

		// Get all courses of the current user
		subGroup.GET("/getCourses", func(c echo.Context) error {
			return handlers.GetCourses(app, c)
		})

		// Get all event documents that the current user participate in
		subGroup.GET("/getParticipatedCourses", func(c echo.Context) error {
			return handlers.GetParticipatedCourses(app, c)
		})

		// Get all participants from the current user's documents
		subGroup.GET("/getContacts", func(c echo.Context) error {
			return handlers.GetContacts(app, c)
		})

		// Get all starred participants from the current user's documents
		subGroup.GET("/getStarredContacts", func(c echo.Context) error {
			return handlers.GetStarredContacts(app, c)
		})

		// Get all documents that the query person participate in the current user's document
		subGroup.GET("/getSharedDocuments/:toPerson", func(c echo.Context) error {
			return handlers.GetSharedDocuments(app, c)
		})

		// Get all participants for the current user's particular doc
		subGroup.GET("/getAllDocParticipants/:docId", func(c echo.Context) error {
			return handlers.GetAllDocParticipants(app, c)
		})

		// Get all starred relationships with the current user
		// Deprecated since We don't need to add contact manually anymore - add star will automatically add new relationships
		subGroup.GET("/getRelationships", func(c echo.Context) error {
			return handlers.GetRelationships(app, c)
		})

		// Get all possible new relationships options for the current user.
		// Deprecated since We don't need to add contact manually anymore - add star will automatically add new relationships
		subGroup.GET("/getNewRelationshipsOptions", func(c echo.Context) error {
			return handlers.GetNewRelationshipsOptions(app, c)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
