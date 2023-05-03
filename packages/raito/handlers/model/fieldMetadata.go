package model

import (
	"strconv"
	"strings"

	"github.com/pocketbase/pocketbase/models/schema"
)

// DataType enum for parsing string
type DataType int

const (
	STRING DataType = iota
	INT    DataType = iota
	BOOL   DataType = iota
)

// FieldMetadata Fields metadata specifies what fields to expands in the results
//
// Example Simple FieldMetadata argument without `hasGroupBy`:
//
//	{"userDocument.name", "document_name", STRING}
//
// Example FieldMetadata argument paired with `hasGroupBy`:
//
//	{"userDocument.name", "document_name_list", STRING}
type FieldMetadata struct {
	Column string
	Alias  string
	DataType
}

// FieldMetaDataList Fields metadata specifies what fields to expands in the results
//
// Example Simple FieldMetadata argument without `hasGroupBy`:
//
//	FieldMetaDataList{
//		{"userDocument.id", "document_id", STRING},
//		{"userDocument.name", "document_name", STRING},
//	}
//
// Example FieldMetadata argument paired with `hasGroupBy`:
//
//	FieldMetaDataList{
//		{"userDocument.id", "document_id_list", STRING},
//		{"userDocument.name", "document_name_list", STRING},
//	}
type FieldMetaDataList []FieldMetadata

func castListStringsByDatatype(valueStringConcat string, datatype DataType) []any {
	valueStringList := strings.Split(valueStringConcat, ", ")
	resultList := make([]any, len(valueStringList))
	for index, valueString := range valueStringList {
		resultList[index] = castStringByDatatype(valueString, datatype)
	}
	return resultList
}

func castStringByDatatype(valueString string, datatype DataType) any {
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

func toDataType(SchemaFieldType string) DataType {
	switch SchemaFieldType {
	case schema.FieldTypeBool:
		return BOOL
	case schema.FieldTypeNumber:
		return INT
	default:
		return STRING
	}
}
