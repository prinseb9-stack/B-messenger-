package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/bmessenger/server/internal/auth"
	"github.com/bmessenger/server/internal/db"
	"github.com/bmessenger/server/internal/ws"
	"github.com/gorilla/websocket"
)

var database *db.DB
var jwtSecret string
var hub *ws.Hub

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func main() {
	dbURL := os.Getenv("DB_URL")
	jwtSecret = os.Getenv("JWT_SECRET")

	if dbURL == "" {
		dbURL = "postgresql://neondb_owner:npg_0ApRwxhITH6o@ep-silent-field-apvfmp9j.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
	}
	if jwtSecret == "" {
		jwtSecret = "bmessenger-super-secret-key-2026"
	}

	var err error
	database, err = db.Connect(dbURL)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
	log.Println("Database connected!")

	hub = ws.NewHub(database.SaveMessage)
	go hub.Run()
	log.Println("WebSocket hub running!")

	http.HandleFunc("/health", corsMiddleware(healthHandler))
	http.HandleFunc("/auth/register", corsMiddleware(registerHandler))
	http.HandleFunc("/auth/login", corsMiddleware(loginHandler))
	http.HandleFunc("/ws", wsHandler)

	log.Println("B-Messenger server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from query param
	tokenStr := r.URL.Query().Get("token")
	if tokenStr == "" {
		// Try Authorization header
		authHeader := r.Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		}
	}

	if tokenStr == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims, err := auth.ValidateToken(tokenStr, jwtSecret)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	client := ws.NewClient(hub, conn, claims.UserID)
  log.Printf("User connected: %s", claims.UserID)
	hub.Register(client)

	go client.WritePump()
	go client.ReadPump()
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if body.Username == "" || body.Email == "" || body.Password == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(body.Password)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	user, err := database.CreateUser(body.Username, body.Email, hashedPassword)
	if err != nil {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	token, err := auth.GenerateAccessToken(user.ID, jwtSecret)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]string{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	user, err := database.GetUserByEmail(body.Email)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := auth.CheckPassword(body.Password, user.Password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateAccessToken(user.ID, jwtSecret)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]string{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}
