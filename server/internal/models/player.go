package models

import (
	"checkers-server/internal/types"

	"github.com/google/uuid"
)

type Player struct {
	Id     int    `json:"id"`
	Status string `json:"status"`
}

type Session struct {
	Id           uuid.UUID     `json:"id"`
	FirstPlayer  SessionPlayer `json:"firstPlayer"`
	SecondPlayer SessionPlayer `json:"secondPlayer"`
}

type SessionPlayer struct {
	PlayerId   int      `json:"playerId"`
	StepStatus bool     `json:"stepStatus"`
	Type       string   `json:"playerType"`
	Figures    []Figure `json:"playerFigures"`
}

type Figure struct {
	FigureId       int            `json:"figureId"`
	FigureType     string         `json:"figureType"`
	FigurePosition types.Position `json:"figurePosition"`
}
