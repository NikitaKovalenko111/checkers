package socketTransportDto

import "checkers-server/internal/types"

type StepEventDto struct {
	SessionId string         `json:"sessionId"`
	Position  types.Position `json:"newPos"`
}
