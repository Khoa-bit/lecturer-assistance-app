package model

import (
	"fmt"
	"strings"
)

// Build arguments for `SELECT` query from a list of `FieldMetaData` accounting for `GROUP BY`.
func BuildSelectArgs(fieldMetadataList FieldMetaDataList, hasGroupBy bool) string {
	selectBuilder := strings.Builder{}
	for _, metadata := range fieldMetadataList {
		if hasGroupBy {
			selectBuilder.WriteString(fmt.Sprintf(", GROUP_CONCAT(COALESCE(%s, ''), ', ') AS %s", metadata.Column, metadata.Alias))
		} else {
			selectBuilder.WriteString(fmt.Sprintf(", %s AS %s", metadata.Column, metadata.Alias))
		}
	}

	return selectBuilder.String()
}
