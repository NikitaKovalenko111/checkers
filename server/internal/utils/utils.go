package utils

import (
	"checkers-server/internal/models"
	"checkers-server/internal/types"
)

func PickCurrentPlayer(playerId int, session *models.Session) *models.SessionPlayer {
	var currentPlayer *models.SessionPlayer

	if playerId == session.FirstPlayer.PlayerId {
		currentPlayer = &session.FirstPlayer
	} else {
		currentPlayer = &session.SecondPlayer
	}

	return currentPlayer
}

func CheckIfInOneLine(fPoint types.Position, sPoint types.Position) bool {
	stepXPosDelta := fPoint.XPos - sPoint.XPos
	stepYPosDelta := fPoint.YPos - sPoint.YPos

	if stepXPosDelta > stepYPosDelta {
		if fPoint.YPos != (fPoint.XPos - (sPoint.XPos - 1)) {
			return false
		}
	} else {
		if fPoint.YPos != (fPoint.XPos + (sPoint.YPos - sPoint.XPos)) {
			return false
		}
	}

	return true
}
