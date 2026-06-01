package db

import (
	"database/sql"
	"time"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

type User struct {
	ID        string
	Username  string
	Email     string
	Password  string
	CreatedAt time.Time
}

func Connect(url string) (*DB, error) {
	conn, err := sql.Open("postgres", url)
	if err != nil {
		return nil, err
	}
	conn.SetMaxOpenConns(25)
	conn.SetMaxIdleConns(10)
	conn.SetConnMaxLifetime(5 * time.Minute)
	if err := conn.Ping(); err != nil {
		return nil, err
	}
	return &DB{conn}, nil
}

func (d *DB) CreateUser(username, email, hashedPassword string) (*User, error) {
	u := &User{}
	err := d.QueryRow(`
		INSERT INTO users (username, email, password)
		VALUES ($1, $2, $3)
		RETURNING id, username, email, created_at
	`, username, email, hashedPassword).
		Scan(&u.ID, &u.Username, &u.Email, &u.CreatedAt)
	return u, err
}

func (d *DB) GetUserByEmail(email string) (*User, error) {
	u := &User{}
	err := d.QueryRow(`
		SELECT id, username, email, password, created_at
		FROM users WHERE email = $1
	`, email).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (d *DB) SaveMessage(conversationID, senderID, content, msgType string) error {
	_, err := d.Exec(`
		INSERT INTO messages (conversation_id, sender_id, content, type)
		VALUES ($1, $2, $3, $4)
	`, conversationID, senderID, content, msgType)
	return err
}
