package lifecycle

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/types"
	"log"
	"os"
	"regexp"
	"strings"
)

func Setup(app *pocketbase.PocketBase) error {
	log.Println("=====================Setup=====================")
	userCollection, err := app.Dao().FindCollectionByNameOrId("users")
	if err != nil {
		log.Printf("Error loading 'users' collection for setup: %v", err)
		return err
	}

	err = godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
		return err
	}

	// Get the value of GAMI_URL from the environment variables
	userCreateRuleSecret := os.Getenv("USER_CREATE_RULE_SECRET")

	originalCreateRule := ""
	if userCollection.CreateRule != nil {
		originalCreateRule = strings.TrimSpace(*userCollection.CreateRule)
	}

	if strings.Contains(originalCreateRule, userCreateRuleSecret) {
		log.Printf("'users' collection CreateRule: %s\n", *userCollection.CreateRule)
		log.Println("================Setup completed================")
		return nil
	}

	// Compile the regex pattern
	re := regexp.MustCompile(`(@request\.data\.createRuleSecret\s*=\s*)'[^']*'`)

	if strings.Contains(originalCreateRule, "@request.data.createRuleSecret") {
		// Append createRuleSecret
		userCollection.CreateRule = types.Pointer(re.ReplaceAllString(originalCreateRule, fmt.Sprintf(`${1}'%s'`, userCreateRuleSecret)))
		log.Println("Update createRuleSecret")
	} else if len(strings.TrimSpace(originalCreateRule)) > 0 {
		// Append createRuleSecret
		userCollection.CreateRule = types.Pointer(fmt.Sprintf("%s && @request.data.createRuleSecret = '%s'", originalCreateRule, userCreateRuleSecret))
		log.Println("Append createRuleSecret")
	} else {
		// Init createRuleSecret
		userCollection.CreateRule = types.Pointer(fmt.Sprintf("@request.data.createRuleSecret = '%s'", userCreateRuleSecret))
		log.Println("Init createRuleSecret")
	}

	if err = app.Dao().SaveCollection(userCollection); err != nil {
		log.Printf("Error saving 'users' collection for setup: %v", err)
		return err
	}

	log.Printf("'users' collection CreateRule: %s\n", *userCollection.CreateRule)
	log.Println("================Setup completed================")
	return nil
}
