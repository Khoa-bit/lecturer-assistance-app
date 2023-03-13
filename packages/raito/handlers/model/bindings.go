package model

import (
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
)

// `AppendCollectionByNameOrId` finds a single collection by its name (case insensitive) or id and append to chained `FieldMetadataList`.
func (fieldMetadataList FieldMetaDataList) AppendCollectionByNameOrId(nameOrId string, alias string, hasGroupBy bool, app *pocketbase.PocketBase) (FieldMetaDataList, error) {
	collection := &models.Collection{}

	err := app.Dao().CollectionQuery().
		AndWhere(dbx.NewExp("[[id]] = {:id} OR LOWER([[name]])={:name}", dbx.Params{
			"id":   nameOrId,
			"name": strings.ToLower(nameOrId),
		})).
		Limit(1).
		One(collection)
	if err != nil {
		return nil, err
	}

	suffix := ""
	if hasGroupBy {
		suffix = "_list"
	}

	// Base Model: id, updated, created
	baseModelFields := schema.BaseModelFieldNames()
	// Collection's Unique Fields: name, email, gender, etc.
	collectionFields := collection.Schema.Fields()
	newFieldMetadata := make(FieldMetaDataList, len(baseModelFields)+len(collectionFields))

	index := 0
	// load base model fields
	for _, field := range baseModelFields {
		newFieldMetadata[index] = FieldMetadata{
			Column:   fmt.Sprintf("%s.%s", alias, field),
			Alias:    fmt.Sprintf("%s_%s%s", alias, field, suffix),
			DataType: STRING,
		}
		index++
	}

	// load schema fields
	for _, field := range collectionFields {
		newFieldMetadata[index] = FieldMetadata{
			Column:   fmt.Sprintf("%s.%s", alias, field.Name),
			Alias:    fmt.Sprintf("%s_%s%s", alias, field.Name, suffix),
			DataType: toDataType(field.Type),
		}
		index++
	}

	return append(fieldMetadataList, newFieldMetadata...), nil
}
