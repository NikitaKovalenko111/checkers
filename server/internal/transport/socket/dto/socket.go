package socketTransportDto

import "checkers-server/internal/types"

type StepEventDto struct {
	SessionId string         `json:"sessionId"`
	PlayerId  int            `json:"playerId"`
	FigureId  int            `json:"figureId"`
	Position  types.Position `json:"figurePos"`
}
