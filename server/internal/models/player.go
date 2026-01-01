package models

import "github.com/google/uuid"

type Player struct {
	Id     int    `json:"id"`
	Status string `json:"status"`
}

type Session struct {
	Id             uuid.UUID `json:"id"`
	FirstPlayerId  int       `json:"firstPlayerId"`
	SecondPlayerId int       `json:"secondPlayerId"`
}
