package cronFunc

import (
	"bytes"
	"encoding/json"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
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

func AddSendMailEveryMinFunc(c *cron.Cron) *cron.Cron {
	// Load the environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get the value of GAMI_URL from the environment variables
	raitoURL := os.Getenv("RAITO_URL")
	gamiURL := os.Getenv("GAMI_URL")

	// Prepare the POST request body
	authReq := map[string]string{
		"identity": os.Getenv("RAITO_SERVICE_USERNAME"),
		"password": os.Getenv("RAITO_SERVICE_PASSWORD"),
	}

	// Create an HTTP client with the cookie jar
	client := &http.Client{}

	// Create a new cron job that runs every minute
	_, err = c.AddFunc("@every 1m", func() {
		pbAuthData, err := json.Marshal(authReq)
		if err != nil {
			log.Fatalln(err)
		}

		// Send the POST request
		respAuth, err := http.Post(raitoURL+"/api/collections/services/auth-with-password", "application/json", bytes.NewBuffer(pbAuthData))
		if err != nil {
			log.Println(err)
			return
		}
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				log.Printf("Error closing Body: %v", err)
				return
			}
		}(respAuth.Body)

		// Use io.ReadFull() to read the response body into a byte slice
		body := make([]byte, respAuth.ContentLength)
		_, err = io.ReadFull(respAuth.Body, body)
		if err != nil {
			log.Println(err)
			return
		}

		// Parse the JSON response into a PBAuth struct
		var pbAuth PBAuth
		err = json.Unmarshal(body, &pbAuth)
		if err != nil {
			log.Println(err)
			return
		}

		// Convert the PBAuth object to JSON
		pbAuthData, err = json.Marshal(pbAuth)
		if err != nil {
			log.Println(err)
			return
		}

		// Create an HTTP GET request
		req, err := http.NewRequest("GET", gamiURL+"/api/cron/everyminute", nil)
		if err != nil {
			log.Println(err)
			return
		}

		// Add some cookies to the request
		pbAuthCookie := &http.Cookie{Name: "pb_auth", Value: url.QueryEscape(string(pbAuthData)), HttpOnly: true, Secure: true}
		req.AddCookie(pbAuthCookie)

		// Send a GET request to the GAMI_URL every minute
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("Error sending GET request: %v", err)
		} else {
			defer func(Body io.ReadCloser) {
				err := Body.Close()
				if err != nil {
					log.Fatalf("Error closing Body: %v", err)
				}
			}(resp.Body)
			log.Println("Cron job: every 1 minute")
		}
	})
	if err != nil {
		log.Fatalf("Error creating cron job: %v", err)
	}

	return c
}
