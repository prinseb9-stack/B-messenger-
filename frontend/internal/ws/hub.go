package ws

import (
	"sync"
)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

type Message struct {
	FromUserID     string `json:"from_user_id"`
	ToUserID       string `json:"to_user_id"`
	ConversationID string `json:"conversation_id"`
	Content        string `json:"content"`
	Type           string `json:"type"`
	CreatedAt      string `json:"created_at"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		broadcast:  make(chan Message, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.userID] = client
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.userID]; ok {
				delete(h.clients, client.userID)
				close(client.send)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.RLock()
			if client, ok := h.clients[message.ToUserID]; ok {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client.userID)
				}
			}
			if client, ok := h.clients[message.FromUserID]; ok {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client.userID)
				}
			}
			h.mu.RUnlock()
		}
	}
}
