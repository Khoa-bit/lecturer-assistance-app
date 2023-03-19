package model

import (
	"fmt"
	"math"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/models"
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

// GetRequestHandler takes care of querying, parsing and then injecting data into echo.Context.
//
// `mainCollectionName` defines the result structure.
//
// When `hasGroupBy` is true, the `expands` field of each result contains fields lists specified by `GROUP BY` SQL Statement and `fieldMetadataList`.
//
// Else, the `expands` field of each result contains fields specified by the `fieldMetadataList`.
func GetRequestHandler(app *pocketbase.PocketBase, c echo.Context, queryStr string, mainCollectionName string, hasGroupBy bool, fieldMetadataList FieldMetaDataList) error {
	var err error

	// TODO: Implement API Rules
	query := app.Dao().DB().NewQuery(queryStr)

	// fetch models
	items := []dbx.NullStringMap{}
	if err := query.All(&items); err != nil {
		return err
	}

	// count
	totalCount := len(items)

	// full list
	isFullListQueryParam := c.QueryParam("fullList")
	isFullList, err := strconv.ParseBool(isFullListQueryParam)
	if err != nil {
		isFullList = false
	}

	// normalize perPage
	perPageQueryParam := c.QueryParam("perPage")
	perPage, err := strconv.Atoi(perPageQueryParam)
	if isFullList {
		perPage = int(math.Max(1, float64(totalCount)))
	} else if err != nil || perPage <= 0 {
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
			if hasGroupBy {
				expand[metadata.Alias] = castListStringsByDatatype(expandValue, metadata.DataType)
			} else {
				expand[metadata.Alias] = castStringByDatatype(expandValue, metadata.DataType)
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
}
