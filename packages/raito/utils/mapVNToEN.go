package utils

import (
	"strings"
)

func MapVNToEn(input string) string {
	// Define the mapping for Vietnamese characters to English characters
	mapping := map[string]string{
		"á": "a",
		"à": "a",
		"ả": "a",
		"ạ": "a",
		"ã": "a",
		"â": "a",
		"ấ": "a",
		"ầ": "a",
		"ẩ": "a",
		"ậ": "a",
		"ẫ": "a",
		//"ā": "a",
		"ă": "a",
		"ắ": "a",
		"ằ": "a",
		"ẳ": "a",
		"ặ": "a",
		"ẵ": "a",
		"đ": "d",
		"é": "e",
		"è": "e",
		"ẻ": "e",
		"ẹ": "e",
		"ẽ": "e",
		"ê": "e",
		"ế": "e",
		"ề": "e",
		"ể": "e",
		"ệ": "e",
		"ễ": "e",
		//"ē": "e",
		"ì": "i",
		"í": "i",
		"ỉ": "i",
		"ị": "i",
		"ĩ": "i",
		//"î": "i",
		//"ǐ": "i",
		"ò": "o",
		"ó": "o",
		"ô": "o",
		"ố": "o",
		"ồ": "o",
		"ổ": "o",
		"ộ": "o",
		"ỗ": "o",
		"ơ": "o",
		"ớ": "o",
		"ờ": "o",
		"ở": "o",
		"ợ": "o",
		"ỡ": "o",
		"ù": "u",
		"ú": "u",
		"ủ": "u",
		"ụ": "u",
		"ũ": "u",
		"ư": "u",
		"ứ": "u",
		"ừ": "u",
		"ử": "u",
		"ự": "u",
		"ữ": "u",
		//"ǔ": "u",
		"ý": "y",
		"ỳ": "y",
		"ỷ": "y",
		"ỵ": "y",
		"ỹ": "y",
	}

	// Iterate over each character in the input string
	output := ""
	for _, char := range input {
		// Convert the character to lowercase for consistent mapping
		lowerChar := strings.ToLower(string(char))
		// Check if the character exists in the mapping
		if replacement, ok := mapping[lowerChar]; ok {
			output += replacement
		} else {
			// If the character is not found in the mapping, keep the original character
			output += string(char)
		}
	}

	return output
}
