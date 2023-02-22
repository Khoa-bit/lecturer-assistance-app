package auth

import (
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/models"
)

// Only auth records can access this endpoint
func GetUser(app *pocketbase.PocketBase, c echo.Context) (*models.Record, error) {
	authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
	if authRecord == nil {
		return nil, apis.NewForbiddenError("Only auth records can access this endpoint", nil)
	}
	return authRecord, nil
}
