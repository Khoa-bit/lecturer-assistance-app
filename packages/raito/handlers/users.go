package handlers

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"strings"
)

type PBAuth struct {
	Token  string     `json:"token"`
	Record AuthRecord `json:"record"`
}

type AuthRecord struct {
	CollectionId    string `json:"collectionId"`
	CollectionName  string `json:"collectionName"`
	Created         string `json:"created"`
	Email           string `json:"email"`
	EmailVisibility bool   `json:"emailVisibility"`
	Id              string `json:"id"`
	Person          string `json:"person"`
	Updated         string `json:"updated"`
	Username        string `json:"username"`
	Verified        bool   `json:"verified"`
}

// CreatePersonRecordForUser when a new user signup with OAuth, create a person record for a user.
func CreatePersonRecordForUser(app *pocketbase.PocketBase, e *core.RecordAuthWithOAuth2Event) error {
	if e.Record == nil {
		oAuth2User := e.OAuth2User

		usersCollection, err := app.Dao().FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		userRecord := models.NewRecord(usersCollection)
		userRecord.Set("username", strings.ReplaceAll(oAuth2User.Email, "@", "_"))
		userRecord.Set("email", oAuth2User.Email)

		titleCase := cases.Title(language.Vietnamese)
		peopleCollection, err := app.Dao().FindCollectionByNameOrId("people")
		if err != nil {
			return err
		}

		personRecord := models.NewRecord(peopleCollection)
		personRecord.Set("contactLocation", "International University, Block 6, Linh Trung Ward, Thu Duc District, HCM City, Vietnam")
		personRecord.Set("name", titleCase.String(strings.ToLower(e.OAuth2User.Name)))
		personRecord.Set("title", "Lecturer")
		personRecord.Set("isFaculty", "true")
		personRecord.Set("hasAccount", "true")

		if err := app.Dao().SaveRecord(personRecord); err != nil {
			return err
		}

		userRecord.Set("person", personRecord.Id)

		e.Record = userRecord
	}

	return nil
}
