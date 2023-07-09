package handlers

import (
	"fmt"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
	"github.com/xuri/excelize/v2"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"io"
	"net/http"
	"os"
	"raito-pocketbase/handlers/auth"
	"raito-pocketbase/handlers/model"
	"raito-pocketbase/utils"
	"strings"
	"time"
)

// PostResult defines the returned search result structure.
type PostResult struct {
	Page       int `json:"page"`
	PerPage    int `json:"perPage"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
	Items      any `json:"items"`
}

type Student struct {
	ID           string
	No           int
	StudentID    string
	LastName     string
	FirstName    string
	DOB          string
	Gender       string
	MajorID      string
	Major        string
	DepartmentID string
	Class        string
	Exists       bool
}

type Major struct {
	ID      string
	MajorId string
	Name    string
}

type Department struct {
	ID           string
	DepartmentId string
	Name         string
}

var (
	columnNames = []string{
		"No",
		"Student_ID",
		"Last_Name",
		"First_Name",
		"DOB",
		"Gender",
		"Major_ID",
		"Major",
		"Department_ID",
		"Class",
	}
)

const invalid = "Invalid"
const majorInvalid = "Invalid major ID: Check if it exists"
const departmentInvalid = "Invalid department ID: Check if it exists"
const pbIdLen = len("xicna2pwld875zj")

func ParticipantsXlsxImport(app *pocketbase.PocketBase, c echo.Context, isDryRun bool, docId string) error {
	_, err := auth.GetUser(app, c)
	if err != nil {
		return err
	}

	students, joinedStudentIDs, majorMapping, err := readAndParseParticipantsXlsxImport(app, c)
	if err != nil {
		return err
	}

	// Get person id collision to mark each student in students array with Exists tag
	personIdCollisions, err := GetPersonIdCollisions(app, c, joinedStudentIDs)
	for _, personIdCollision := range personIdCollisions.Items {
		for i, student := range students {
			if student.StudentID == personIdCollision.GetString("personId") {
				student.Exists = true
				student.ID = personIdCollision.Id
				students[i] = student
				break
			}
		}
	}

	if isDryRun == false {
		peopleCollection, err := app.Dao().FindCollectionByNameOrId("people")
		if err != nil {
			return err
		}

		participantsCollection, err := app.Dao().FindCollectionByNameOrId("participants")
		if err != nil {
			return err
		}

		for i, student := range students {
			var studentRecord *models.Record
			if !student.Exists {
				studentRecord = models.NewRecord(peopleCollection)
				studentRecord.Set("personId", student.StudentID)
				studentRecord.Set("name", strings.TrimSpace(student.LastName+" "+student.FirstName))
				studentRecord.Set("personalEmail", student.StudentID+"@student.hcmiu.edu.vn")
				studentRecord.Set("title", "Undergraduate")
				studentRecord.Set("dayOfBirth", student.DOB)
				studentRecord.Set("gender", student.Gender)
				if student.MajorID != majorInvalid {
					studentRecord.Set("major", majorMapping[student.MajorID].ID)
				}
				studentRecord.Set("contactLocation", "International University, Block 6, Linh Trung Ward, Thu Duc District, HCM City, Vietnam")
			} else {
				studentRecord, err = app.Dao().FindRecordById("people", student.ID)
				if err != nil {
					return err
				}
			}

			// If Major's id is invalid, set it as an empty string
			majorId := studentRecord.GetString("major")
			if student.MajorID != majorInvalid {
				majorId = majorMapping[student.MajorID].ID
			}

			// Special logic on person's creation
			personalEmail := studentRecord.GetString("personalEmail")
			title := studentRecord.GetString("title")
			contactLocation := studentRecord.GetString("contactLocation")
			if !student.Exists {
				personalEmail = student.StudentID + "@student.hcmiu.edu.vn"
				title = "Undergraduate"
				contactLocation = "International University, Block 6, Linh Trung Ward, Thu Duc District, HCM City, Vietnam"
			}

			form := forms.NewRecordUpsert(app, studentRecord)
			err = form.LoadData(map[string]any{
				"personId":        student.StudentID,
				"name":            strings.TrimSpace(student.LastName + " " + student.FirstName),
				"personalEmail":   personalEmail,
				"title":           title,
				"dayOfBirth":      student.DOB,
				"gender":          student.Gender,
				"major":           majorId,
				"contactLocation": contactLocation,
			})
			if err != nil {
				return err
			}

			// update the student in the student array
			student.ID = studentRecord.Id
			students[i] = student

			if err := form.Submit(); err != nil {
				return err
			}

			// There is a unique pair index of document and person id in Participant collection
			if len(docId) == pbIdLen {
				participantRecord := models.NewRecord(participantsCollection)
				participantForm := forms.NewRecordUpsert(app, participantRecord)
				err = participantForm.LoadData(map[string]any{
					"permission": "read",
					"document":   docId,
					"person":     student.ID,
				})
				if err != nil {
					fmt.Println(err.Error())
				}

				if err := participantForm.Submit(); err != nil {
					fmt.Println(err.Error())
				}
			}
		}
	}

	// Pagination
	totalCount := len(students)
	page, perPage, totalPages, startPage, endPage, err := model.PaginateItems(c, totalCount)
	paginatedStudents := students[startPage:endPage]

	result := &PostResult{
		Page:       page,
		PerPage:    perPage,
		TotalItems: totalCount,
		TotalPages: totalPages,
		Items:      paginatedStudents,
	}

	return c.JSON(http.StatusOK, result)
}

func validateColumnOrder(headers []string) bool {
	if len(headers) != len(columnNames) {
		return false
	}
	for i, columnName := range columnNames {
		if headers[i] != columnName {
			return false
		}
	}
	return true
}

func readAndParseParticipantsXlsxImport(app *pocketbase.PocketBase, c echo.Context) (students []Student, joinedStudentIDs string, majorMapping map[string]Major, err error) {
	fileHeader, err := c.FormFile("xlsxImportFile")
	if err != nil {
		return nil, "", nil, c.JSON(http.StatusBadRequest, err.Error())
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, "", nil, c.JSON(http.StatusBadRequest, err.Error())
	}
	defer file.Close()

	// Create a temporary file to save the uploaded XLSX file
	tempDir := os.TempDir()
	tempFile, err := os.CreateTemp(tempDir, "*.xlsx")
	if err != nil {
		return nil, "", nil, c.JSON(http.StatusInternalServerError, err.Error())
	}
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()

	// Copy the uploaded file to the temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		return nil, "", nil, c.JSON(http.StatusInternalServerError, err.Error())
	}

	// Open the XLSX file using excelize
	excelReader, err := excelize.OpenFile(tempFile.Name())
	if err != nil {
		return nil, "", nil, c.JSON(http.StatusInternalServerError, err.Error())
	}

	sheetName := excelReader.GetSheetName(0) // Replace 1 with the actual sheet index (1-based)
	rows, err := excelReader.GetRows(sheetName)
	if err != nil {
		return nil, "", nil, err
	}

	rowsCount := len(rows)
	students = make([]Student, rowsCount-1)
	studentIDs := make([]string, rowsCount-1)
	majorMapping = make(map[string]Major)
	departmentMapping := make(map[string]Department)

	for i, row := range rows {
		// Validate column order
		if i == 0 {
			if !validateColumnOrder(row) {
				return nil, "", nil, c.JSON(http.StatusInternalServerError, "Failed to import: Invalid format")
			}
			continue
		}

		var student Student
		titleCase := cases.Title(language.Vietnamese)
		upperCase := cases.Upper(language.Vietnamese)

		for rowIndex := 0; rowIndex < len(rows[0]); rowIndex++ {
			var colCell string
			if rowIndex >= 0 && rowIndex < len(row) {
				colCell = row[rowIndex]
			} else {
				colCell = ""
			}
			colCell = strings.TrimSpace(colCell)
			switch rowIndex {
			case 0:
				student.No = i
			case 1:
				student.StudentID = colCell
				// format for SQL query
				studentIDs[i-1] = fmt.Sprintf("'%s'", colCell)
			case 2:
				student.LastName = titleCase.String(colCell)
			case 3:
				student.FirstName = titleCase.String(colCell)
			case 4:
				dobParse, err := time.Parse("02/01/2006", colCell)
				if err != nil {
					student.DOB = ""
				} else {
					student.DOB = dobParse.Format("2006-01-02 15:04:05.000Z")
				}
			case 5:
				gender := titleCase.String(colCell)
				if strings.EqualFold("Nam", gender) || strings.EqualFold("Male", gender) || strings.EqualFold("Man", gender) || strings.EqualFold("Masculine", gender) {
					gender = "Male"
				} else if strings.EqualFold("Nu", utils.MapVNToEn(gender)) || strings.EqualFold("Female", gender) || strings.EqualFold("Woman", gender) || strings.EqualFold("Feminine", gender) {
					gender = "Female"
				} else {
					gender = ""
				}
				student.Gender = gender
			case 6:
				majorId := upperCase.String(colCell)

				major, majorIdExists := majorMapping[majorId]
				if !majorIdExists && len(majorId) > 0 {
					// skip err take the default colCell
					majorRecords, _ := app.Dao().FindRecordsByExpr("majors",
						dbx.NewExp("majorId = {:majorId}", dbx.Params{"majorId": majorId}),
					)
					// Get the first record
					if len(majorRecords) > 0 {
						majorMapping[majorId] = Major{ID: majorRecords[0].Id, MajorId: majorId, Name: majorRecords[0].GetString("name")}
						student.DepartmentID = majorRecords[0].GetString("department")
					} else {
						majorMapping[majorId] = Major{ID: invalid, MajorId: majorInvalid, Name: invalid}
					}

					major = majorMapping[majorId]
				}

				student.Major = major.Name
				student.MajorID = major.MajorId
			case 7:
				if len(student.Major) == 0 {
					student.Major = colCell
				}
			case 8:
				departmentId := upperCase.String(colCell)

				department, departmentIdExists := departmentMapping[departmentId]
				if !departmentIdExists {
					// skip err take the default colCell
					departmentRecords, _ := app.Dao().FindRecordsByExpr("departments",
						dbx.NewExp("departmentId = {:departmentId}", dbx.Params{"departmentId": departmentId}),
					)

					// Get the first record
					if len(departmentRecords) > 0 && !departmentIdExists {
						departmentMapping[departmentId] = Department{ID: departmentRecords[0].Id, DepartmentId: departmentId, Name: departmentRecords[0].GetString("name")}
						// Fall-back to empty Major if there is an _EMPTY record in DB
						if len(student.MajorID) == 0 {
							majorId := departmentId + "_EMPTY"
							majorRecord, err := app.Dao().FindFirstRecordByData("major", "majorId", majorId)
							if err == nil {
								majorMapping[majorId] = Major{ID: majorRecord.Id, MajorId: majorId, Name: ""}
								student.MajorID = majorMapping[majorId].MajorId
								student.Major = majorMapping[majorId].Name
							}
						}
					} else {
						departmentMapping[departmentId] = Department{ID: invalid, DepartmentId: departmentInvalid, Name: invalid}
					}

					department = departmentMapping[departmentId]
				}
				student.DepartmentID = department.DepartmentId
			case 9:
				student.Class = colCell
			}
		}

		students[i-1] = student
	}

	joinedStudentIDs = strings.Join(studentIDs, ",")

	return students, joinedStudentIDs, majorMapping, nil
}
